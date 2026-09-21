# Maintenance log

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
