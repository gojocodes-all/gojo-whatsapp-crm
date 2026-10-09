const GREETINGS = new Set(["hi", "hello", "hey", "menu", "start"]);

function extractIncomingMessages(body) {
  if (body?.object !== "whatsapp_business_account") {
    return [];
  }

  const entries = Array.isArray(body.entry) ? body.entry : [];
  const incomingMessages = [];

  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : [];

    for (const change of changes) {
      const messages = Array.isArray(change?.value?.messages)
        ? change.value.messages
        : [];
      const contacts = Array.isArray(change?.value?.contacts)
        ? change.value.contacts
        : [];

      for (const message of messages) {
        if (
          !message ||
          typeof message.from !== "string" ||
          message.from.trim() === ""
        ) {
          continue;
        }

        const contact =
          contacts.find((candidate) => candidate?.wa_id === message.from) ||
          contacts[0];

        incomingMessages.push({ message, contact });
      }
    }
  }

  return incomingMessages;
}

async function processWebhookBody(
  body,
  { Message, Conversation, sendMainMenu, sendServicesMenu }
) {
  const incomingMessages = extractIncomingMessages(body);

  for (const { message, contact } of incomingMessages) {
    await Message.create({
      from: message.from,
      name: contact?.profile?.name || "Unknown",
      message: message.text?.body || "",
      type: message.type,
    });

    const phone = message.from;
    const text = message.text?.body?.trim();
    const actionId = message.interactive?.list_reply?.id;

    const conversation = await Conversation.findOne({ phone });
    if (!conversation) {
      await Conversation.create({ phone });
    }

    if (text && GREETINGS.has(text.toLowerCase())) {
      await sendMainMenu(phone);
    }

    if (actionId === "services") {
      await sendServicesMenu(phone);
    }
  }

  return incomingMessages.length;
}

module.exports = {
  extractIncomingMessages,
  processWebhookBody,
};
