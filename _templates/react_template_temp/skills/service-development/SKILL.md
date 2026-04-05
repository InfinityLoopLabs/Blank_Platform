---
name: service-development
description: Build or update services in `app/features/services` using the `_template/service` conventions (container/store/structure/lib/constants) so code stays consistent with project rules.
metadata:
  short-description: Service implementation workflow
---

# Service Development

## When to use
- Creating a new service (copy `_template/service` into `app/features/services/<serviceName>` and rename Sample placeholders).
- Updating container/store/structure/lib/constants for an existing service while keeping template rules intact.

## Quick start
0) Scaffold via CLI: `new service name` (service name is lowercase; CLI normalizes). Add `--ns` if the service does **not** need a Redux slice (no store injection).
1) Keep export surface the same (`index.tsx` re-exports store/constants/lib and exposes `{ service: useContainer }` from a lowercase export).
2) Replace placeholder DTO/UI types, schemas, and data models; move every magic number/string into `constants/` and re-export via `constants/index.ts`.
3) If the service is global (app-wide side effects), register it in the root ServiceInjector services list.

## File roles and guardrails
- **container (`container/index.ts`)**
  - Hook signature stays `useContainer: SC`; no props passed.
  - Comment every logical block with `// Описание: Начало/Конец`; do not comment the return; update comments instead of deleting.
  - Naming: camelCase vars/functions, PascalCase components/types, booleans with is/has/should/can; handlers named `on***Handler`; use meaningful names.
  - No `useCallback`/`useMemo` (React compiler handles it).
  - Constants in SCREAMING_SNAKE_CASE under `constants/` with barrel re-export; no inline magic literals.
  - If the service talks to backend and you map data between layers, keep transformations in `lib/mappers` (do not do mapping in container).

- **index.tsx**
  - Must export a lowercase service object to avoid collisions with widgets:
    - `export const auth = { service: useContainer }`
  - Re-export `constants`, `store`, `lib` to support `useAppActions` auto-binding.

- **store/index.ts**
  - Only reducers inside `createSlice`; no extra functions.
  - `initialState` imported from `structure`; do not type `initialState`.
  - Re-export via `Actions` and `Reducer` (used by `useAppActions` and store assembly).

- **structure/index.ts**
  - Holds `initialState` only; no functions; no type declaration for the state object.

- **lib/types**
  - Use `type` aliases (no interfaces) with `Type` suffix; enums with `Enum` suffix.
  - No function type definitions here; boolean names with is/has/should/can.
  - Put request/response DTO adapters here if service interacts with API/persistence.

- **lib/mappers**
  - Sole place for DTO ↔ internal model transformations; return `Nullable` where appropriate.

- **lib/schemas**
  - Yup schemas for forms/validation when needed; keys should be enums from `lib/types`.

- **lib/utils**
  - Lightweight helpers that consume typed data; magic values go to `constants/`.

- **constants/**
  - SCREAMING_SNAKE_CASE, meaningful names, no single-letter or cryptic abbreviations; re-export through `constants/index.ts`.
  - `name.ts` builds a service name from `NAME_FROM_PACKAGE_JSON` (service naming, not widget naming).

## Store and actions wiring
If you scaffolded without `--ns`, the CLI will auto-inject:
- Reducer import + reducer key into `app/application/store/reducers.ts` under `// Services: Начало`
- Actions binding into `app/utils/hooks/useAppActions.ts`

If you scaffolded with `--ns`:
- CLI will NOT inject reducer/hooks. Keep the service free of Redux usage (or wire it manually if you later add a slice).

## Do not confuse templates
- repo root `_template/service/*`: scaffolding templates used by the `new` CLI
- widget-local `templates/*`: UI decomposition pieces used by widgets (not applicable to services)

## Final checks
- Comments preserved/updated per template; no inline magic values; types/mappers/schemas/constants live in their dedicated files.
- Export name casing: service export is lowercase in `index.tsx`.
- If the service is app-global: it is included in the `ServiceInjector` list in `/app/root.tsx`.
