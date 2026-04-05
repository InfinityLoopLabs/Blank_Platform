# ILL CLI

Config-driven CLI runner.

## Architecture

- Core: load config -> find command key -> execute steps in order.
- Plugin contract: each plugin has `type`, `parse(rawStep, context)`, `execute(payload, context)`.
- Built-in plugins (5 folders): `add`, `download`, `insert`, `remove-line`, `remove`.

## Usage

```bash
ill <commandKey> --name=MyFeature
```

Also supported:

```bash
ill <commandKey> --name MyFeature --config ./infinityloop.config.js --cwd .
```

Initialize config in current folder from built-in template:

```bash
ill init --repo owner/template-repo --ref main
```

## Config

CLI auto-detects one of:

- `infinityloop.config.js`
- `infinityloop.config.mjs`
- `infinityloop.config.cjs`

`commands` is a hash-map where each key is a command, and value is an array of steps.

```js
module.exports = {
  commands: {
    createWidget: [
      {
        type: "add",
        from: "_templates/react_template/_template/widget",
        to: "generated/widgets/$name",
        replace: [{ Sample: "$name" }, { sample: "$name" }],
      },
      {
        type: "paste",
        to: "generated/widgets/$name/README.md",
        content: "\nCreated for $name\n",
        mode: "append",
      },
    ],
    removeWidget: [
      {
        type: "remove",
        target: "generated/widgets/$name",
      },
    ],
  },
};
```

## Step Types

- `add`: copy file/folder from `from` to `to` with optional `replace`.
- `download`: clone template repository via `git clone` and copy into current `cwd` with git artifacts removed (`.git`, `.github`, and names starting with `.git`).
- `insert`: insert `line` after `placeholder` in `file`.
- `remove-line`: remove a line from `file` by text match.
- `remove`: delete file/folder at `target`.

`init` command creates `infinityloop.config.js` in current `cwd`:

```bash
ill init --repo owner/template-repo --ref main
```

Options:
- `--repo`: template repo (`owner/repo`, URL, or local git path).
- `--ref`: branch/tag/commit-ish for clone.
- `--force`: overwrite existing `infinityloop.config.js`.

`download` example:

```js
module.exports = {
  commands: {
    bootstrap: [
      {
        type: "download",
        repo: "owner/template-repo", // or full URL/path
        ref: "main", // optional
        allowNonEmpty: false, // optional, default false
      },
    ],
  },
};
```

## Example With Placeholder

```js
module.exports = {
  commands: {
    patchHooks: [
      {
        type: "insert",
        file: "app/utils/hooks.ts",
        placeholder: "// Insert Hooks here",
        line: "createAppActions($name)",
      },
      {
        type: "remove-line",
        file: "app/utils/hooks.ts",
        line: "createAppActions($name)",
      },
    ],
  },
};
```
