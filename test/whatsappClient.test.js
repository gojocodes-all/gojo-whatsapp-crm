const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createWhatsAppClient,
  GRAPH_API_VERSION,
} = require("../services/whatsappClient");

function createHttpClient() {
  const calls = [];

  return {
    calls,
    httpClient: {
      async post(...args) {
        calls.push(args);
        return { data: { messages: [{ id: "sent-message" }] } };
      },
    },
  };
}

test("sends text through the configured WhatsApp Graph endpoint", async () => {
  const { calls, httpClient } = createHttpClient();
  const client = createWhatsAppClient({
    httpClient,
    env: {
      PHONE_NUMBER_ID: " phone-id ",
      WHATSAPP_TOKEN: " access-token ",
    },
  });

  const response = await client.sendText("2348012345678", "Hello");

  assert.deepEqual(response.data, { messages: [{ id: "sent-message" }] });
  assert.deepEqual(calls, [
    [
      `https://graph.facebook.com/${GRAPH_API_VERSION}/phone-id/messages`,
      {
        messaging_product: "whatsapp",
        to: "2348012345678",
        text: { body: "Hello" },
      },
      {
        headers: {
          Authorization: "Bearer access-token",
          "Content-Type": "application/json",
        },
      },
    ],
  ]);
});

test("sends interactive content through the same transport", async () => {
  const { calls, httpClient } = createHttpClient();
  const client = createWhatsAppClient({
    httpClient,
    env: {
      PHONE_NUMBER_ID: "phone/id",
      WHATSAPP_TOKEN: "token",
    },
  });
  const interactive = {
    type: "list",
    body: { text: "Choose an option" },
  };

  await client.sendInteractive("2348098765432", interactive);

  assert.equal(
    calls[0][0],
    `https://graph.facebook.com/${GRAPH_API_VERSION}/phone%2Fid/messages`
  );
  assert.deepEqual(calls[0][1], {
    messaging_product: "whatsapp",
    to: "2348098765432",
    type: "interactive",
    interactive,
  });
});

test("rejects missing credentials before making an HTTP request", async () => {
  const { calls, httpClient } = createHttpClient();
  const missingPhoneClient = createWhatsAppClient({ httpClient, env: {} });
  const missingTokenClient = createWhatsAppClient({
    httpClient,
    env: { PHONE_NUMBER_ID: "phone-id", WHATSAPP_TOKEN: "   " },
  });

  await assert.rejects(
    missingPhoneClient.sendText("2348012345678", "Hello"),
    /PHONE_NUMBER_ID/
  );
  await assert.rejects(
    missingTokenClient.sendText("2348012345678", "Hello"),
    /WHATSAPP_TOKEN/
  );
  assert.deepEqual(calls, []);
});

test("reads environment configuration when a message is sent", async () => {
  const { calls, httpClient } = createHttpClient();
  const env = {};
  const client = createWhatsAppClient({ httpClient, env });

  env.PHONE_NUMBER_ID = "late-phone-id";
  env.WHATSAPP_TOKEN = "late-token";

  await client.sendText("2348012345678", "Hello");

  assert.equal(calls.length, 1);
  assert.equal(
    calls[0][0],
    `https://graph.facebook.com/${GRAPH_API_VERSION}/late-phone-id/messages`
  );
});
