# Repository Guidelines

## Project Structure & Module Organization
- `src/` — application code: `components/`, `screens/`, `hooks/`, `lib/`, `store/`.
- `assets/` — images, fonts; import via `require` or URI.
- `tests/` — unit/integration tests mirroring `src/` structure.
- Native (if applicable): `ios/`, `android/`. Config: `app.json`/`app.config.js`.
- Tooling: `package.json`, `tsconfig.json`, `.eslintrc.*`, `.prettierrc`.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run start` — start Metro/dev server.
- `npm run ios` / `npm run android` — build and run on simulator/device.
- `npm test` — run unit tests (Jest).
- `npm run lint` / `npm run typecheck` — lint and TypeScript checks.
- `npm run fmt` — format with Prettier.
Tips: If a script is missing, use `npx react-native start` or check `package.json` for the exact script names.

## Coding Style & Naming Conventions
- Language: TypeScript preferred (`.ts`/`.tsx`). Indent 2 spaces.
- Formatting: Prettier (single quotes, trailing commas, semicolons on).
- Linting: ESLint with React/TypeScript plugins; fix warnings before PR.
- Naming: React components `PascalCase.tsx`; other files `kebab-case.ts`.
- Exports: prefer named exports; avoid default where practical.
- Imports: favor absolute aliases (e.g., `@/components/Button`).

## Testing Guidelines
- Frameworks: Jest + `@testing-library/react-native` for UI.
- File names: `*.test.ts` or `*.test.tsx` colocated with code or under `tests/`.
- Coverage: target ≥80% lines/branches on changed code.
- Run: `npm test` (use `-u` to update snapshots when appropriate).

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Keep commits focused; one logical change per commit.
- PRs must include: clear description, linked issues, screenshots for UI changes, test updates, and notes on breaking changes/migrations.
- Pass CI (build, tests, lint, typecheck) before requesting review.

## Security & Configuration Tips
- Never commit secrets. Use `.env` and provide `.env.example`.
- Add `.env` to `.gitignore`; reference via `react-native-config` or app config.
- Store API endpoints/keys in config files; use per‑env variants.

## Agent-Specific Instructions
- Keep diffs minimal and scoped to the task.
- Follow the structure and conventions above for any new files.
- Update this document if introducing new tools, scripts, or directories.
