# GOJO WhatsApp CRM

A small WhatsApp Business CRM prototype for receiving webhook messages, storing conversations in MongoDB, replying through the Meta Graph API, and viewing conversations in a React dashboard.

## What is implemented

- An Express API that connects to MongoDB before accepting requests
- A testable application module that can be validated without a database connection
- Meta WhatsApp webhook verification and inbound message handling
- Storage for messages and per-phone conversation state
- Text-message sending through the WhatsApp Cloud API
- A basic automated main menu and services menu
- A React dashboard that groups messages by phone number and refreshes every three seconds

## Important status

This repository is a prototype, not a production-ready CRM. The API currently has permissive CORS, the message and send routes have no authentication, the webhook verification token is defined in source, and the frontend API URL is fixed in `frontend/src/services/api.js`. Do not expose a deployment containing real customer data until those areas are secured and configured for its environment.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (the versions required by the installed Vite 8 release)
- npm
- MongoDB
- A Meta app with WhatsApp Cloud API access, a phone number ID, and an access token

## Local setup

1. Clone the repository and enter it:

   ```bash
   git clone https://github.com/gojocodes-all/gojo-whatsapp-crm.git
   cd gojo-whatsapp-crm
   ```

2. Install backend dependencies:

   ```bash
   npm ci
   ```

3. Create the backend environment file:

   ```bash
   cp .env.example .env
   ```

   Fill in the values described in [`.env.example`](.env.example). Never commit the completed `.env` file.

4. Start the backend:

   ```bash
   npm run dev
   ```

   The API uses port `3000` unless `PORT` is set. A successful start prints the MongoDB connection message before the server message.

5. In another terminal, install and start the frontend:

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

   For local end-to-end development, change the `baseURL` in `frontend/src/services/api.js` to the local backend URL. The current value points to the deployed Render API.

## WhatsApp webhook configuration

Meta must be able to reach the backend over HTTPS. Configure the callback URL as:

```text
https://your-api-host.example/webhook
```

The verification value configured in Meta must match the `VERIFY_TOKEN` used by `routes/webhook.js`. That value is currently defined in source; move it to an environment variable before using the application beyond development.

The webhook handler processes every valid message across all entries and changes in delivery order. Text greetings (`hi`, `hello`, `hey`, `menu`, or `start`) open the main menu, and the `services` list action opens the services menu.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | Basic service status response |
| `GET` | `/webhook` | Meta webhook verification |
| `POST` | `/webhook` | Receive and store WhatsApp webhook messages |
| `GET` | `/messages` | Return stored messages, newest first |
| `POST` | `/send` | Send a text message; expects `{ "to": "...", "message": "..." }` |

The application does not currently provide route authentication. Treat `/messages` and `/send` as private until access control is added.

## Project structure

```text
config/              MongoDB connection
controllers/         WhatsApp Cloud API helpers and bot menus
models/              Mongoose message and conversation models
routes/              Webhook, message-list, and send endpoints
services/            Testable webhook batch processing
frontend/            React and Vite dashboard
app.js               Express middleware, routes, and status endpoint
server.js            Database connection and process startup
test/                 Backend HTTP and webhook processor tests
```

## Available commands

From the repository root:

- `npm run dev` — start the API with nodemon
- `npm start` — start the API with Node.js
- `npm run check` — syntax-check backend source and tests
- `npm test` — run backend tests without MongoDB or Meta credentials
- `npm run validate` — run all backend checks and tests

From `frontend/`:

- `npm run dev` — start the Vite development server
- `npm run build` — create a production frontend build
- `npm run lint` — lint frontend JavaScript and JSX
- `npm run preview` — preview the production build locally

Pull requests and changes to `main` run the backend validation plus the frontend lint and production build in GitHub Actions.

## Contributing

Keep changes focused and avoid committing `.env`, access tokens, customer messages, or phone numbers. Run `npm run validate` for backend changes. For frontend changes, run `npm run lint` and `npm run build` inside `frontend/`. Changes that depend on MongoDB, Meta credentials, or live webhook delivery still require manual verification against non-production services. Describe any environment or webhook changes in the pull request.
