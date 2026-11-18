const axios = require("axios");
const Conversation = require("../models/Conversation");

async function sendText(to, text) {
  return axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: {
        body: text,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

async function sendMainMenu(to) {
  return axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "🚀 GOJO.DEV",
        },
        body: {
          text:
            "Crafting premium digital experiences through websites, web applications, and digital solutions tailored to your needs.\n\nChoose an option below and let's build something amazing together.",
        },
        action: {
          button: "Choose an option",
          sections: [
            {
              title: "Main Menu",
              rows: [
                {
                  id: "services",
                  title: "🌐 Our Services",
                },
                {
                  id: "portfolio",
                  title: "💼 View Portfolio",
                },
                {
                  id: "contact",
                  title: "📞 Contact Us",
                },
                {
                  id: "quote",
                  title: "💰 Get a Quote",
                },
              ],
            },
          ],
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

async function sendServicesMenu(to) {
  return axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: "🌐 Our Services\n\nSelect the service you need.",
        },
        action: {
          button: "View Services",
          sections: [
            {
              title: "Services",
              rows: [
                {
                  id: "business",
                  title: "🌍 Business Websites",
                },
                {
                  id: "ecommerce",
                  title: "🛒 E-Commerce Stores",
                },
                {
                  id: "school",
                  title: "🏫 School Websites",
                },
                {
                  id: "landing",
                  title: "🎨 Landing Pages",
                },
                {
                  id: "webapp",
                  title: "⚡ Web Applications",
                },
                {
                  id: "maintenance",
                  title: "🔧 Website Maintenance",
                },
                {
                  id: "custom",
                  title: "🧩 Custom Website",
                },
                {
                  id: "main",
                  title: "🔙 Back",
                },
              ],
            },
          ],
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

module.exports = {
  sendText,
  sendMainMenu,
  sendServicesMenu,
};
