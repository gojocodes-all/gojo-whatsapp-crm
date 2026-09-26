const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");

const createApp = require("../app");

async function withServer(run) {
  const server = createApp().listen(0, "127.0.0.1");
  await once(server, "listening");

  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

test("GET / reports that the API is running", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^text\/html/);
    assert.equal(await response.text(), "GOJO WhatsApp CRM running 🚀");
  });
});

test("webhook verification rejects an invalid token", async () => {
  await withServer(async (baseUrl) => {
    const query = new URLSearchParams({
      "hub.mode": "subscribe",
      "hub.verify_token": "incorrect",
      "hub.challenge": "challenge",
    });
    const response = await fetch(`${baseUrl}/webhook?${query}`);

    assert.equal(response.status, 403);
  });
});

test("unknown routes return Express's 404 response", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/not-a-route`);

    assert.equal(response.status, 404);
  });
});

test("the server module exposes startup without listening on import", () => {
  const { startServer } = require("../server");

  assert.equal(typeof startServer, "function");
});
