export function latestMessagePerChat(messages) {
  const seen = new Set();

  return messages.filter((message) => {
    if (seen.has(message.from)) return false;
    seen.add(message.from);
    return true;
  });
}

export function messagesForChat(messages, phone) {
  return messages.filter((message) => message.from === phone).reverse();
}
