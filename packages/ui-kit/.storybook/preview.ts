import type { Preview } from "@storybook/react"

import "../src/index.css"

type ThemeMode = "light" | "dark"
type BackgroundMode = "light" | "dark" | "clear"

const THEME_STORAGE_KEY = "ui-kit-storybook-theme"
const THEME_TOGGLE_ID = "ui-kit-theme-toggle"
const THEME_TOGGLE_BUTTON_ID = "ui-kit-theme-toggle-button"
const LIGHT_CANVAS_COLOR = "#f8fafc"
const DARK_CANVAS_COLOR = "#0f172a"

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
  if (backgroundValue === "light" || backgroundValue === "dark" || backgroundValue === "clear") {
    return backgroundValue
  }

  return null
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

  if (backgroundMode === "clear") {
    document.body.style.backgroundColor = "transparent"
    document.documentElement.style.backgroundColor = "transparent"
    return
  }

  if (backgroundMode === "light") {
    document.body.style.backgroundColor = LIGHT_CANVAS_COLOR
    document.documentElement.style.backgroundColor = LIGHT_CANVAS_COLOR
    return
  }

  if (backgroundMode === "dark") {
    document.body.style.backgroundColor = DARK_CANVAS_COLOR
    document.documentElement.style.backgroundColor = DARK_CANVAS_COLOR
    return
  }

  const syncedBackground = theme === "dark" ? DARK_CANVAS_COLOR : LIGHT_CANVAS_COLOR
  document.body.style.backgroundColor = syncedBackground
  document.documentElement.style.backgroundColor = syncedBackground
}

const updateToggleButtonLabel = (theme: ThemeMode) => {
  const button = document.getElementById(THEME_TOGGLE_BUTTON_ID) as HTMLButtonElement | null
  if (!button) {
    return
  }

  button.textContent = theme === "dark" ? "Dark" : "Light"
  button.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`)
}

const ensureThemeToggle = (theme: ThemeMode, onToggle: () => void) => {
  if (document.getElementById(THEME_TOGGLE_ID)) {
    updateToggleButtonLabel(theme)
    return
  }

  const container = document.createElement("div")
  container.id = THEME_TOGGLE_ID
  container.style.position = "fixed"
  container.style.top = "12px"
  container.style.right = "12px"
  container.style.zIndex = "9999"
  container.style.padding = "4px"
  container.style.borderRadius = "999px"
  container.style.border = "1px solid var(--border)"
  container.style.background = "color-mix(in oklab, var(--background) 90%, transparent)"
  container.style.backdropFilter = "blur(8px)"

  const button = document.createElement("button")
  button.id = THEME_TOGGLE_BUTTON_ID
  button.type = "button"
  button.style.minWidth = "72px"
  button.style.height = "30px"
  button.style.padding = "0 12px"
  button.style.borderRadius = "999px"
  button.style.border = "1px solid var(--border)"
  button.style.background = "var(--card)"
  button.style.color = "var(--foreground)"
  button.style.cursor = "pointer"
  button.style.fontSize = "12px"
  button.style.fontWeight = "600"
  button.style.lineHeight = "1"
  button.style.fontFamily = "var(--font-app, ui-sans-serif, system-ui, sans-serif)"
  button.addEventListener("click", onToggle)

  container.appendChild(button)
  document.body.appendChild(container)
  updateToggleButtonLabel(theme)
}

let currentTheme: ThemeMode = "dark"
let currentBackgroundMode: BackgroundMode | null = null

const preview: Preview = {
  initialGlobals: {
    backgrounds: {
      value: "clear",
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof window !== "undefined") {
        currentBackgroundMode = resolveBackgroundMode(context.globals?.backgrounds?.value)

        if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
          currentTheme = resolveInitialTheme()
          window.localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
        } else {
          const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
          currentTheme = storedTheme === "light" ? "light" : "dark"
        }

        applyTheme(currentTheme, currentBackgroundMode)
        ensureThemeToggle(currentTheme, () => {
          currentTheme = currentTheme === "dark" ? "light" : "dark"
          window.localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
          applyTheme(currentTheme, currentBackgroundMode)
          updateToggleButtonLabel(currentTheme)
        })
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
    backgrounds: {
      options: {
        light: { name: "Light", value: LIGHT_CANVAS_COLOR },
        dark: { name: "Dark", value: DARK_CANVAS_COLOR },
        clear: { name: "Clear", value: "transparent" },
      },
    },
    layout: "centered",
  },
}

export default preview
