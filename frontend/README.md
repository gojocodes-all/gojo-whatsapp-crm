# GOJO WhatsApp CRM frontend

This directory contains the React and Vite dashboard for the project. For architecture, backend setup, environment variables, webhook configuration, and security limitations, see the [root README](../README.md).

## Commands

```bash
npm ci
npm run dev
```

- `npm run build` creates the production bundle in `dist/`.
- `npm run lint` runs ESLint across the frontend.
- `npm run preview` serves the production bundle locally.

## API configuration

The Axios client is defined in `src/services/api.js`. Its `baseURL` currently points to the deployed Render backend. Change that value to `http://localhost:3000` when running the API locally.

The dashboard requests `/messages` every three seconds, groups messages by sender, and posts outgoing text messages to `/send`.
