const assert = require("node:assert/strict");
const test = require("node:test");

const messagesModule = import("../frontend/src/utils/messages.js");

test("keeps the newest message for each conversation summary", async () => {
  const { latestMessagePerChat } = await messagesModule;
  const messages = [
    { _id: "new-111", from: "111", message: "Newest from Ada" },
    { _id: "new-222", from: "222", message: "Newest from Grace" },
    { _id: "old-111", from: "111", message: "Oldest from Ada" },
  ];

  assert.deepEqual(
    latestMessagePerChat(messages).map((message) => message._id),
    ["new-111", "new-222"]
  );
});

test("renders a selected conversation oldest-first without mutating API results", async () => {
  const { messagesForChat } = await messagesModule;
  const messages = [
    { _id: "new-111", from: "111", message: "Newest from Ada" },
    { _id: "new-222", from: "222", message: "Newest from Grace" },
    { _id: "old-111", from: "111", message: "Oldest from Ada" },
  ];
  const originalOrder = messages.map((message) => message._id);

  assert.deepEqual(
    messagesForChat(messages, "111").map((message) => message._id),
    ["old-111", "new-111"]
  );
  assert.deepEqual(
    messages.map((message) => message._id),
    originalOrder
  );
});

test("only enables replies with a conversation, content, and no active send", async () => {
  const { canSendMessage } = await messagesModule;

  assert.equal(
    canSendMessage({ selected: "2348012345678", text: " Hello ", sending: false }),
    true
  );
  assert.equal(
    canSendMessage({ selected: "", text: "Hello", sending: false }),
    false
  );
  assert.equal(
    canSendMessage({ selected: "2348012345678", text: "   ", sending: false }),
    false
  );
  assert.equal(
    canSendMessage({ selected: "2348012345678", text: "Hello", sending: true }),
    false
  );
});
