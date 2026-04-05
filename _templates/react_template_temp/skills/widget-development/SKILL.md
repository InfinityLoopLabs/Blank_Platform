---
name: widget-development
description: Build or update widgets in `app/features/widgets` using the `_template/widget` conventions (container/UI/lib/store/constants) so code stays consistent with project rules.
metadata:
  short-description: Widget implementation workflow
---

# Widget Development

## When to use
- Creating a new widget (copy `_template/widget` into `app/features/widgets/<WidgetName>` and rename Sample placeholders).
- Updating container/UI/lib/store/constants for an existing widget while keeping template rules intact.

## Quick start
0) Scaffold via CLI: `new widget Name` (Name starts with capital). Add `--ns` if the widget does **not** need Redux slice (common case).
1) Copy the template folder, rename files/types/components from Sample to the widget name, and set `constants/name.ts` to include the widget identifier (built on `NAME_FROM_PACKAGE_JSON`).
2) Keep export surface the same (`index.tsx` re-exports store/constants/lib and exposes `Container.displayName = name`); register the reducer where the feature is consumed if the widget needs store state.
3) Replace placeholder DTO/UI types, schemas, and data-testids; move every magic number/string into `constants/` and re-export via `constants/index.ts`.
4) Do not confuse:
   - repo root `_template/*`: scaffolding templates used by the `new` CLI
   - widget-local `templates/*`: UI decomposition pieces used by the widget itself (still pure-render, no hooks)

## File roles and guardrails
- **container/useContainer.ts**
  - Hook signature stays `useContainer: CC<UIPropertyType>`; no props passed.
  - Comment every logical block with `// Описание: Начало/Конец`; do not comment the return; update comments instead of deleting.
  - Naming: camelCase vars/functions, PascalCase components/types, booleans with is/has/should/can; handlers named `on***Handler`; use meaningful names.
  - No `useCallback`/`useMemo` (React compiler handles it).
  - Data flow: backend ↔ UI goes through `lib/mappers`; forms use `useForm<SampleFieldsType>` + schema from `lib/schemas`; types live in `lib/types`.
  - Constants in SCREAMING_SNAKE_CASE under `constants/` with barrel re-export; no magic literals inline.
  - Query naming pattern:
    ```ts
    const {
      data: sampleData,
      isLoading: isSampleLoading,
      isSuccess: isGetSampleSuccess,
      isError: isGetSampleError,
      refetch: refetchSample,
    } = useGetSampleByIdQuery({})
    ```
    Mutation naming pattern:
    ```ts
    const [
      updateSampleTrigger, // or createSampleTrigger
      {
        data: sampleData,
        isLoading: isSampleLoading,
        isSuccess: isGetSampleSuccess,
        isError: isGetSampleError,
        refetch: refetchSample,
      },
    ] = useUpdateDraftMutation()
    ```
  - Keep navigation params in refs to avoid stale closures; expose `isEnabled`, `isLoading`, and mapped UI data in return.

- **UI (`ui/index.tsx`) and templates (`templates/Sample/index.tsx`)**
  - Pure render only: no hooks/logic; no `React.memo`/`useCallback`/`useMemo`.
  - Comment logical blocks with JSX `{/* Описание: Начало/Конец */}`; keep and update existing comments.
  - Functions typed via `Callback<Value, ReturnType>` or `VoidFunction`; handler naming `on***Handler`.
  - Arrays rendered via `ArrayRender`; `className` composed with `clsx`.
  - Use `Flex` component instead of flex classes; prefer `Nullable<Type>` over `|| null`.
  - Forms: `UseFormControlType<SampleFieldsEnum>` + `<Controller/>`; types from `lib/types`; data flows through mappers.
  - Do not rename `OwnPropertyType` in templates; keep meaningful dti values (`constants/data-testid.ts`).

- **lib/types**
  - Use `type` aliases (no interfaces) with `Type` suffix; enums with `Enum` suffix.
  - No function type definitions here; boolean names with is/has/should/can.
  - House DTO adapters (Request/Response), UI types, web-client types, and form enums/records.

- **lib/mappers**
  - Sole place for DTO ↔ UI transformations; isolate backend contract changes; return `Nullable`.

- **lib/schemas**
  - Yup schemas for forms; add fields keyed by enums; constants still live in `constants/`.

- **lib/utils**
  - Lightweight helpers that consume typed data; keep null-handling helpers simple; magic values go to `constants/`.

- **store/index.ts**
  - Only reducers inside `createSlice`; no extra functions; initial state imported from `structure`.
  - Do not type `initialState`; constants from `constants/`; re-export actions/reducer via `Actions` and `Reducer`.

- **structure/index.ts**
  - Holds `initialState` only; no functions; no type declaration for the state object.

- **constants/**
  - SCREAMING_SNAKE_CASE, meaningful names, no single-letter or cryptic abbreviations; re-export through `constants/index.ts`.
  - `name.ts` builds a widget name from `NAME_FROM_PACKAGE_JSON`; `data-testid.ts` derives `dti` from `name`.

- **index.tsx**
  - `Container` wraps `UI` with `useContainer()`; keep displayName set to `name`; re-export store/constants/lib for consumers.

## Final checks
- Comments preserved/updated per template; no hooks/logic leaked into UI; no inline magic values; types/mappers/schemas/constants live in their dedicated files.
- Query/mutation naming matches patterns; data flows through mappers; form types/schemas align.
- Exports updated after renaming Sample artifacts; store reducer registered where needed.
