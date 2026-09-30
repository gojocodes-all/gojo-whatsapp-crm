# Maintenance log

## 2026-09-30 — Outgoing message input validation

### Rationale

`POST /send` destructured `req.body` before entering its error boundary and forwarded missing or blank values to the WhatsApp Cloud API. Requests without a JSON body could therefore become server errors, while incomplete JSON triggered unnecessary upstream calls instead of receiving a clear client error.

### Files changed

- `routes/send.js` — safely handles an absent body and requires `to` and `message` to be non-empty strings before calling Meta.
- `test/app.test.js` — added HTTP regression coverage for missing bodies and blank values.
- `.github/maintenance-log.md` — recorded this maintenance work.

### Validation

- `npm ci`
- `npm run validate`
- `npm ci && npm run lint && npm run build` in `frontend/`
- `git diff --check`
- Complete diff review for valid-request compatibility, error handling, security, and repository conventions.

### Risk

Low. Valid requests keep the same payload and upstream behavior. Only malformed requests change, receiving HTTP 400 before any Meta API call. No dependency, configuration, database, or frontend behavior changes.

### Rollback

Revert this pull request to restore the previous send-route behavior and remove its focused regression tests.

## 2026-09-26 — Testable API runtime and CI

### Rationale

`server.js` constructed the Express application, connected to MongoDB, and opened the network listener as soon as it was imported. That coupling prevented deterministic HTTP validation without a database connection and left backend changes without an automated regression gate.

### Files changed

- `app.js` — added a side-effect-free Express application factory containing middleware, routes, and the status endpoint.
- `server.js` — reduced the process entry point to environment loading, database readiness, and listener startup; exported `startServer` for controlled reuse.
- `test/app.test.js` — added dependency-free HTTP smoke tests for service health, invalid webhook verification, and unknown routes.
- `package.json` — corrected the package entry point and added `check`, `test`, and `validate` scripts.
- `.github/workflows/ci.yml` — added read-only backend validation plus frontend lint and production-build checks.
- `README.md` — documented the new module boundary, commands, automated checks, and remaining integration-test requirements.

### Validation

- `npm ci`
- `npm run validate`
- `npm ci && npm run lint && npm run build` in `frontend/`
- `git diff --check`
- Complete diff review for route parity, startup order, security, frontend compatibility, and repository conventions.

### Risk

Low. Route paths, middleware order, response content, database-before-listen behavior, port selection, dependencies, and external API behavior are unchanged. The new tests use an ephemeral local port and do not access MongoDB, Meta, credentials, or customer data.

### Rollback

Revert this pull request to restore the single-file server entry point and remove the tests and CI workflow.

## 2026-09-21 — Repository documentation foundation

### Rationale

The repository had no root documentation, and the frontend README still described the generic Vite starter. Contributors could not determine the required services, environment variables, available commands, webhook path, API surface, or current security limitations from the repository documentation.

### Files changed

- `README.md` — documented the implemented architecture, requirements, setup, webhook behavior, API routes, project structure, commands, limitations, and contribution checks.
- `.env.example` — added safe placeholders for the four environment variables read by the backend.
- `frontend/README.md` — replaced starter text with frontend-specific setup and API configuration notes.
- `.github/maintenance-log.md` — recorded this maintenance work.

### Validation

- Compared every documented command with the root and frontend `package.json` scripts.
- Compared environment variables with their usages in `server.js`, `config/db.js`, `controllers/botController.js`, and `routes/send.js`.
- Compared route and behavior descriptions with `server.js` and the files in `routes/`.
- Parsed both package manifests as JSON.
- Ran the frontend ESLint and production build commands.
- Checked the final diff for secrets, unsupported capabilities, runtime changes, and broken relative links.

### Risk

Low. The change affects documentation and a non-secret example environment file only; application behavior and dependencies are unchanged.

### Rollback

Revert the pull request's squash commit to restore the previous documentation state.
