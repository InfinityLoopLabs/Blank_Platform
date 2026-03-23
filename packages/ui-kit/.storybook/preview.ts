import type { Preview } from "@storybook/react"
import React from "react"
import { Moon, Sun } from "lucide-react"
import { useGlobals } from "storybook/preview-api"
import type { Root } from "react-dom/client"
import { createRoot } from "react-dom/client"

import { Toggle } from "../src/components/atoms/Toggle"
import "../src/index.css"

type ThemeMode = "light" | "dark"

const THEME_STORAGE_KEY = "ui-kit-storybook-theme"
const THEME_TOGGLE_ID = "ui-kit-theme-toggle"
const LIGHT_CANVAS_COLOR = "#f8fafc"
const DARK_CANVAS_COLOR = "#0f172a"

const readStoredTheme = (): ThemeMode => {
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

const writeStoredTheme = (theme: ThemeMode) => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

const applyTheme = (theme: ThemeMode) => {
  const syncedBackground = theme === "dark" ? DARK_CANVAS_COLOR : LIGHT_CANVAS_COLOR

  document.body.classList.remove("dark")
  document.documentElement.classList.remove("dark")
  document.body.style.colorScheme = theme
  document.documentElement.style.colorScheme = theme

  if (theme === "dark") {
    document.body.classList.add("dark")
    document.documentElement.classList.add("dark")
  }

  document.body.style.backgroundColor = syncedBackground
  document.documentElement.style.backgroundColor = syncedBackground
}

const ThemeToggleOverlay = ({
  theme,
  onToggle,
}: {
  theme: ThemeMode
  onToggle: () => void
}) => {
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
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: "9999",
        padding: "4px 8px",
        borderRadius: "999px",
        border: "1px solid var(--border)",
        background: "color-mix(in oklab, var(--background) 90%, transparent)",
        backdropFilter: "blur(8px)",
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

const renderThemeToggle = (theme: ThemeMode, onToggle: () => void) => {
  if (typeof document === "undefined") {
    return
  }

  let container = document.getElementById(THEME_TOGGLE_ID)
  if (!container) {
    container = document.createElement("div")
    container.id = THEME_TOGGLE_ID
    document.body.appendChild(container)
  }

  if (!themeToggleRoot) {
    themeToggleRoot = createRoot(container)
  }

  themeToggleRoot.render(React.createElement(ThemeToggleOverlay, { theme, onToggle }))
}

const preview: Preview = {
  initialGlobals: {
    backgrounds: {
      value: DARK_CANVAS_COLOR,
      grid: true,
    },
  },
  decorators: [
    Story => {
      const [globals, updateGlobals] = useGlobals()
      const [theme, setTheme] = React.useState<ThemeMode>(() => readStoredTheme())
      const isGridInitializedRef = React.useRef(false)

      const backgroundGlobals = (globals as { backgrounds?: { value?: unknown; grid?: unknown } }).backgrounds
      const backgroundValue = backgroundGlobals?.value
      const gridEnabled = backgroundGlobals?.grid === true

      const onToggleTheme = React.useCallback(() => {
        setTheme(previousTheme => (previousTheme === "dark" ? "light" : "dark"))
      }, [])

      React.useEffect(() => {
        writeStoredTheme(theme)
        applyTheme(theme)
        renderThemeToggle(theme, onToggleTheme)
      }, [theme, onToggleTheme])

      React.useEffect(() => {
        if (isGridInitializedRef.current) {
          return
        }

        isGridInitializedRef.current = true
        if (gridEnabled) {
          return
        }

        updateGlobals({
          backgrounds: {
            ...(backgroundGlobals ?? {}),
            grid: true,
          },
        })
      }, [backgroundGlobals, gridEnabled, updateGlobals])

      React.useEffect(() => {
        const targetBackgroundValue = theme === "dark" ? DARK_CANVAS_COLOR : LIGHT_CANVAS_COLOR
        const isBackgroundSynced = backgroundValue === targetBackgroundValue

        if (isBackgroundSynced && gridEnabled) {
          return
        }

        updateGlobals({
          backgrounds: {
            ...(backgroundGlobals ?? {}),
            value: targetBackgroundValue,
            grid: true,
          },
        })
      }, [backgroundGlobals, backgroundValue, gridEnabled, theme, updateGlobals])

      return React.createElement(Story)
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "Showcase",
          ["Form Example", "Offer Countdown"],
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
      },
    },
    layout: "centered",
  },
}

export default preview
