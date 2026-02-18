---
name: library-build-sync
description: Use when creating or updating JavaScript/TypeScript libraries in this monorepo; require building the library first and then running yarn in `_templates/react_template` so the template picks up the latest local library version.
metadata:
  short-description: Build libs, then sync React template
---

# Library Build Sync

## When to use
- You created or changed a JS/TS library in `packages/*`.
- You need `_templates/react_template` to use the latest library build.

## Required workflow
1. Build the changed library (or all libraries) with `yarn build`.
2. After build is complete, run `yarn` inside `_templates/react_template`.
3. Continue normal Turborepo flow (`yarn build`, `yarn start`, tests).

## Command examples
- Single library:
  - `cd packages/<library-name>`
  - `yarn build`
  - `cd ../../_templates/react_template`
  - `yarn`
- Full repo libraries:
  - `cd /Users/m1max/IdeaProjects/infinitylooplabs/Platform`
  - `yarn build:libs`
  - `cd _templates/react_template`
  - `yarn`

## Guardrails
- Do not skip library build before installing in React template.
- Do not skip `yarn` in `_templates/react_template` after library changes.
- If several libraries changed, finish all builds first, then run one `yarn` in `_templates/react_template`.

## Response requirement
- If this skill is used, the final assistant message must end with a short note confirming usage.
- Use this exact line at the end: `Библиотеки засинхронизированны`.
