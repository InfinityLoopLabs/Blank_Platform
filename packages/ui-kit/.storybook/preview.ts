import type { Preview } from "@storybook/react"

import "../src/index.css"

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme",
      defaultValue: "dark",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = context.globals.theme as "light" | "dark" | "system"
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      const resolvedTheme = selectedTheme === "system" ? (prefersDark ? "dark" : "light") : selectedTheme

      document.body.classList.remove("dark")
      document.documentElement.classList.remove("dark")
      document.body.style.colorScheme = resolvedTheme
      document.documentElement.style.colorScheme = resolvedTheme

      if (resolvedTheme === "dark") {
        document.body.classList.add("dark")
        document.documentElement.classList.add("dark")
      }

      return Story()
    },
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: "centered",
  },
}

export default preview
