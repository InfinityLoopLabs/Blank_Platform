# ILL CLI

Config-driven CLI runner.

## Usage

```bash
ill <commandKey> --name=MyFeature
```

Also supported:

```bash
ill <commandKey> --name MyFeature --config ./infinityloop.config.js --cwd .
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

- `add`: copy folder from `from` to `to` with optional `replace`.
- `paste`: write `content` to file `to` (`append` by default; also `prepend` or `replace`).
- `remove`: delete `target` path recursively.

## Replace Rules

`replace` is an array of objects. Two formats are supported:

- `{ from: "Sample", to: "$name" }`
- `{ "Sample": "$name" }`

`$name` comes from CLI argument `--name`.

Case is preserved by match:

- `sample` -> `popup`
- `Sample` -> `Popup`
- `SAMPLE` -> `POPUP`
