const dotenv = require("dotenv");
const createApp = require("./app");
const connectDB = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  const app = createApp();
  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
