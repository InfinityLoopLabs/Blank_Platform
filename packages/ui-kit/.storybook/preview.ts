import type { Preview } from "@storybook/react"
import { UPDATE_GLOBALS } from "@storybook/core-events"
import { addons } from "@storybook/preview-api"
import React from "react"
import type { Root } from "react-dom/client"
import { createRoot } from "react-dom/client"
import { Moon, Sun } from "lucide-react"

import { Toggle } from "../src/components/atoms/Toggle"

import "../src/index.css"

type ThemeMode = "light" | "dark"
type BackgroundMode = "light" | "dark" | "clear"

const THEME_STORAGE_KEY = "ui-kit-storybook-theme"
const THEME_TOGGLE_ID = "ui-kit-theme-toggle"
const LIGHT_CANVAS_COLOR = "#f8fafc"
const DARK_CANVAS_COLOR = "#0f172a"
const CLEAR_CANVAS_VALUE = "transparent"

const resolveInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark"
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

const resolveBackgroundMode = (backgroundValue: unknown): BackgroundMode | null => {
  if (backgroundValue === "light" || backgroundValue === "dark") {
    return backgroundValue
  }

  if (backgroundValue === "clear") {
    return "dark"
  }

  if (backgroundValue === LIGHT_CANVAS_COLOR) {
    return "light"
  }

  if (backgroundValue === DARK_CANVAS_COLOR) {
    return "dark"
  }

  if (backgroundValue === CLEAR_CANVAS_VALUE) {
    return "dark"
  }

  return null
}

const syncStorybookBackgroundGlobals = (theme: ThemeMode) => {
  const channel = addons.getChannel()
  const syncedBackgroundMode: BackgroundMode = theme === "dark" ? "dark" : "light"
  const syncedBackgroundValue = theme === "dark" ? DARK_CANVAS_COLOR : LIGHT_CANVAS_COLOR
  currentBackgroundMode = syncedBackgroundMode

  channel.emit(UPDATE_GLOBALS, {
    globals: {
      backgrounds: {
        value: syncedBackgroundValue,
        grid: true,
      },
    },
  })
}

const applyTheme = (theme: ThemeMode, backgroundMode: BackgroundMode | null) => {
  document.body.classList.remove("dark")
  document.documentElement.classList.remove("dark")
  document.body.style.colorScheme = theme
  document.documentElement.style.colorScheme = theme

  if (theme === "dark") {
    document.body.classList.add("dark")
    document.documentElement.classList.add("dark")
  }

  const syncedBackground =
    backgroundMode === "light" ? LIGHT_CANVAS_COLOR : theme === "dark" ? DARK_CANVAS_COLOR : LIGHT_CANVAS_COLOR
  document.body.style.backgroundColor = syncedBackground
  document.documentElement.style.backgroundColor = syncedBackground
}

const themeToggleContainerStyle: Partial<CSSStyleDeclaration> = {
  position: "fixed",
  top: "12px",
  right: "12px",
  zIndex: "9999",
  padding: "4px 8px",
  borderRadius: "999px",
  border: "1px solid var(--border)",
  background: "color-mix(in oklab, var(--background) 90%, transparent)",
  backdropFilter: "blur(8px)",
}

const renderThemeToggle = (theme: ThemeMode, onToggle: () => void) => {
  const iconStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 180ms ease",
    color: "var(--foreground)",
  }

  return React.createElement(
    "div",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      },
    },
    React.createElement(Sun, {
      size: 14,
      style: {
        ...iconStyle,
        opacity: theme === "light" ? 1 : 0.5,
      },
      "aria-hidden": true,
    }),
    React.createElement(Toggle, {
      checked: theme === "dark",
      onChange: onToggle,
      className: "gap-0",
      "aria-label": `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
    }),
    React.createElement(Moon, {
      size: 14,
      style: {
        ...iconStyle,
        opacity: theme === "dark" ? 1 : 0.5,
      },
      "aria-hidden": true,
    }),
  )
}

let themeToggleRoot: Root | null = null

const ensureThemeToggle = (theme: ThemeMode, onToggle: () => void) => {
  let container = document.getElementById(THEME_TOGGLE_ID) as HTMLDivElement | null
  if (!container) {
    container = document.createElement("div")
    container.id = THEME_TOGGLE_ID
    Object.assign(container.style, themeToggleContainerStyle)
    document.body.appendChild(container)
  }

  if (!themeToggleRoot) {
    themeToggleRoot = createRoot(container)
  }

  themeToggleRoot.render(renderThemeToggle(theme, onToggle))
}

let currentTheme: ThemeMode = "dark"
let currentBackgroundMode: BackgroundMode | null = null

const preview: Preview = {
  initialGlobals: {
    backgrounds: {
      value: DARK_CANVAS_COLOR,
      grid: true,
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof window !== "undefined") {
        if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
          currentTheme = resolveInitialTheme()
          window.localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
        } else {
          const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
          currentTheme = storedTheme === "light" ? "light" : "dark"
        }

        const rawBackgroundValue = context.globals?.backgrounds?.value
        const resolvedBackgroundMode = resolveBackgroundMode(rawBackgroundValue)
        const isClearBackground = rawBackgroundValue === "clear" || rawBackgroundValue === CLEAR_CANVAS_VALUE
        const gridEnabled = context.globals?.backgrounds?.grid === true

        if (isClearBackground || resolvedBackgroundMode !== currentTheme || !gridEnabled) {
          syncStorybookBackgroundGlobals(currentTheme)
        }

        currentBackgroundMode = currentTheme
        applyTheme(currentTheme, currentBackgroundMode)

        const onToggleTheme = () => {
          currentTheme = currentTheme === "dark" ? "light" : "dark"
          window.localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
          syncStorybookBackgroundGlobals(currentTheme)
          currentBackgroundMode = currentTheme
          applyTheme(currentTheme, currentBackgroundMode)
          ensureThemeToggle(currentTheme, onToggleTheme)
        }

        ensureThemeToggle(currentTheme, onToggleTheme)
      }

      return Story()
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "Showcase",
          ["Form Example"],
          "Design",
          ["Color Palette", "Typography", "Custom CSS"],
          "Atoms",
        ],
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      options: {
        light: { name: "Light", value: LIGHT_CANVAS_COLOR },
        dark: { name: "Dark", value: DARK_CANVAS_COLOR },
        clear: { name: "Clear", value: CLEAR_CANVAS_VALUE },
      },
    },
    layout: "centered",
  },
}

export default preview
