const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
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

test("keeps the dashboard usable at narrow viewport widths", () => {
  const root = path.resolve(__dirname, "..");
  const dashboard = fs.readFileSync(
    path.join(root, "frontend/src/pages/Dashboard.jsx"),
    "utf8"
  );
  const sidebar = fs.readFileSync(
    path.join(root, "frontend/src/components/Sidebar.jsx"),
    "utf8"
  );
  const chatWindow = fs.readFileSync(
    path.join(root, "frontend/src/components/ChatWindow.jsx"),
    "utf8"
  );
  const styles = fs.readFileSync(
    path.join(root, "frontend/src/index.css"),
    "utf8"
  );
  const html = fs.readFileSync(
    path.join(root, "frontend/index.html"),
    "utf8"
  );

  assert.match(dashboard, /<main className="dashboard-shell">/);
  assert.match(sidebar, /className="conversation-sidebar"/);
  assert.match(chatWindow, /className="chat-window"/);
  assert.match(styles, /@media \(max-width: 700px\)/);
  assert.match(styles, /\.dashboard-shell\s*{\s*flex-direction: column;/);
  assert.match(
    styles,
    /\.conversation-sidebar\s*{[^}]*width: 100%;[^}]*max-height: 38%;/s
  );
  assert.match(
    styles,
    /\.chat-window\s*{[^}]*width: 100%;[^}]*min-height: 0;/s
  );
  assert.match(html, /<title>GOJO WhatsApp CRM<\/title>/);
});
