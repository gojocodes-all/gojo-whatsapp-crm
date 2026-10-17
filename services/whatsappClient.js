const axios = require("axios");

const GRAPH_API_VERSION = "v23.0";

function requireConfigValue(env, name) {
  const value = env[name];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function createWhatsAppClient({
  httpClient = axios,
  env = process.env,
  apiVersion = GRAPH_API_VERSION,
} = {}) {
  async function postMessage(to, message) {
    const phoneNumberId = requireConfigValue(env, "PHONE_NUMBER_ID");
    const token = requireConfigValue(env, "WHATSAPP_TOKEN");

    return httpClient.post(
      `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(phoneNumberId)}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        ...message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  return {
    sendText(to, text) {
      return postMessage(to, { text: { body: text } });
    },
    sendInteractive(to, interactive) {
      return postMessage(to, { type: "interactive", interactive });
    },
  };
}

const defaultClient = createWhatsAppClient();

module.exports = {
  GRAPH_API_VERSION,
  createWhatsAppClient,
  sendInteractive: defaultClient.sendInteractive,
  sendText: defaultClient.sendText,
};
