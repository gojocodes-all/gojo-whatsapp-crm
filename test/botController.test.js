const assert = require("node:assert/strict");
const test = require("node:test");

const whatsappClient = require("../services/whatsappClient");
const {
  sendMainMenu,
  sendServicesMenu,
  sendText,
} = require("../controllers/botController");

test("bot responses retain their payloads through the shared client", async (t) => {
  const calls = [];
  const originalSendInteractive = whatsappClient.sendInteractive;
  const originalSendText = whatsappClient.sendText;

  t.after(() => {
    whatsappClient.sendInteractive = originalSendInteractive;
    whatsappClient.sendText = originalSendText;
  });

  whatsappClient.sendText = async (...args) => calls.push(["text", ...args]);
  whatsappClient.sendInteractive = async (...args) =>
    calls.push(["interactive", ...args]);

  await sendText("111", "Hello");
  await sendMainMenu("222");
  await sendServicesMenu("333");

  assert.deepEqual(calls[0], ["text", "111", "Hello"]);

  assert.equal(calls[1][0], "interactive");
  assert.equal(calls[1][1], "222");
  assert.equal(calls[1][2].type, "list");
  assert.deepEqual(calls[1][2].header, {
    type: "text",
    text: "🚀 GOJO.DEV",
  });
  assert.deepEqual(
    calls[1][2].action.sections[0].rows.map(({ id, title }) => [id, title]),
    [
      ["services", "🌐 Our Services"],
      ["portfolio", "💼 View Portfolio"],
      ["contact", "📞 Contact Us"],
      ["quote", "💰 Get a Quote"],
    ]
  );

  assert.equal(calls[2][0], "interactive");
  assert.equal(calls[2][1], "333");
  assert.equal(
    calls[2][2].body.text,
    "🌐 Our Services\n\nSelect the service you need."
  );
  assert.deepEqual(
    calls[2][2].action.sections[0].rows.map(({ id, title }) => [id, title]),
    [
      ["business", "🌍 Business Websites"],
      ["ecommerce", "🛒 E-Commerce Stores"],
      ["school", "🏫 School Websites"],
      ["landing", "🎨 Landing Pages"],
      ["webapp", "⚡ Web Applications"],
      ["maintenance", "🔧 Website Maintenance"],
      ["custom", "🧩 Custom Website"],
      ["main", "🔙 Back"],
    ]
  );
});
