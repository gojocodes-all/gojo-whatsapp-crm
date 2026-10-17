const whatsappClient = require("../services/whatsappClient");

async function sendText(to, text) {
  return whatsappClient.sendText(to, text);
}

async function sendMainMenu(to) {
  return whatsappClient.sendInteractive(to, {
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
  });
}

async function sendServicesMenu(to) {
  return whatsappClient.sendInteractive(to, {
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
  });
}

module.exports = {
  sendText,
  sendMainMenu,
  sendServicesMenu,
};
