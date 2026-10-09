const assert = require("node:assert/strict");
const test = require("node:test");

const {
  extractIncomingMessages,
  processWebhookBody,
} = require("../services/webhookProcessor");

function createDependencies() {
  const calls = [];

  return {
    calls,
    dependencies: {
      Message: {
        async create(message) {
          calls.push(["message", message]);
        },
      },
      Conversation: {
        async findOne(query) {
          calls.push(["find-conversation", query]);
          return query.phone === "111" ? { phone: query.phone } : null;
        },
        async create(conversation) {
          calls.push(["create-conversation", conversation]);
          return conversation;
        },
      },
      async sendMainMenu(phone) {
        calls.push(["main-menu", phone]);
      },
      async sendServicesMenu(phone) {
        calls.push(["services-menu", phone]);
      },
    },
  };
}

test("extracts every valid message across entries and changes", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              contacts: [
                { wa_id: "111", profile: { name: "Ada" } },
                { wa_id: "222", profile: { name: "Grace" } },
              ],
              messages: [
                { from: "111", type: "text", text: { body: "hi" } },
                {
                  from: "222",
                  type: "interactive",
                  interactive: { list_reply: { id: "services" } },
                },
              ],
            },
          },
          {
            value: {
              contacts: [{ wa_id: "333", profile: { name: "Linus" } }],
              messages: [
                { from: "", type: "text", text: { body: "ignored" } },
                { from: "333", type: "image" },
              ],
            },
          },
        ],
      },
      {
        changes: [
          {
            value: {
              messages: [
                { from: "444", type: "text", text: { body: "Hello" } },
              ],
            },
          },
        ],
      },
    ],
  };

  const messages = extractIncomingMessages(payload);

  assert.deepEqual(
    messages.map(({ message, contact }) => [
      message.from,
      contact?.profile?.name,
    ]),
    [
      ["111", "Ada"],
      ["222", "Grace"],
      ["333", "Linus"],
      ["444", undefined],
    ]
  );
});

test("processes every extracted message sequentially", async () => {
  const { calls, dependencies } = createDependencies();
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              contacts: [
                { wa_id: "111", profile: { name: "Ada" } },
                { wa_id: "222", profile: { name: "Grace" } },
              ],
              messages: [
                { from: "111", type: "text", text: { body: " hi " } },
                {
                  from: "222",
                  type: "interactive",
                  interactive: { list_reply: { id: "services" } },
                },
              ],
            },
          },
        ],
      },
      {
        changes: [
          {
            value: {
              messages: [
                { from: "333", type: "text", text: { body: "ordinary" } },
              ],
            },
          },
        ],
      },
    ],
  };

  const count = await processWebhookBody(payload, dependencies);

  assert.equal(count, 3);
  assert.deepEqual(calls, [
    [
      "message",
      { from: "111", name: "Ada", message: " hi ", type: "text" },
    ],
    ["find-conversation", { phone: "111" }],
    ["main-menu", "111"],
    [
      "message",
      { from: "222", name: "Grace", message: "", type: "interactive" },
    ],
    ["find-conversation", { phone: "222" }],
    ["create-conversation", { phone: "222" }],
    ["services-menu", "222"],
    [
      "message",
      { from: "333", name: "Unknown", message: "ordinary", type: "text" },
    ],
    ["find-conversation", { phone: "333" }],
    ["create-conversation", { phone: "333" }],
  ]);
});

test("ignores non-message webhook payloads", async () => {
  const { calls, dependencies } = createDependencies();

  assert.equal(
    await processWebhookBody(
      {
        object: "whatsapp_business_account",
        entry: [{ changes: [{ value: { statuses: [{ id: "status" }] } }] }],
      },
      dependencies
    ),
    0
  );
  assert.equal(
    await processWebhookBody({ object: "unrelated" }, dependencies),
    0
  );
  assert.deepEqual(calls, []);
});
