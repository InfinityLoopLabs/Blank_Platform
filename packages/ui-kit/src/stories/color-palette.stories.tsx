import type { Meta, StoryObj } from "@storybook/react"

type ColorToken = {
  name: string
  varName: string
  textVarName?: string
  purpose: string
}

type ColorGroup = {
  title: string
  tokens: ColorToken[]
}

const colorGroups: ColorGroup[] = [
  {
    title: "Base",
    tokens: [
      {
        name: "background",
        varName: "--background",
        textVarName: "--foreground",
        purpose: "Базовый фон приложения и страниц.",
      },
      {
        name: "foreground",
        varName: "--foreground",
        textVarName: "--background",
        purpose: "Основной цвет текста и иконок.",
      },
      {
        name: "border",
        varName: "--border",
        textVarName: "--foreground",
        purpose: "Рамки, разделители и контуры блоков.",
      },
      {
        name: "input",
        varName: "--input",
        textVarName: "--foreground",
        purpose: "Фон и/или рамка полей ввода.",
      },
      {
        name: "ring",
        varName: "--ring",
        textVarName: "--background",
        purpose: "Фокус-обводка интерактивных элементов.",
      },
    ],
  },
  {
    title: "Semantic",
    tokens: [
      {
        name: "primary",
        varName: "--primary",
        textVarName: "--primary-foreground",
        purpose: "Главные CTA-кнопки и ключевые акценты.",
      },
      {
        name: "secondary",
        varName: "--secondary",
        textVarName: "--secondary-foreground",
        purpose: "Вторичные кнопки и нейтральные действия.",
      },
      {
        name: "muted",
        varName: "--muted",
        textVarName: "--muted-foreground",
        purpose: "Приглушенные подложки и второстепенный контент.",
      },
      {
        name: "accent",
        varName: "--accent",
        textVarName: "--accent-foreground",
        purpose: "Hover/selected состояния и локальные акценты.",
      },
      {
        name: "destructive",
        varName: "--destructive",
        textVarName: "--background",
        purpose: "Опасные действия: delete/reset/critical.",
      },
    ],
  },
  {
    title: "Surface",
    tokens: [
      {
        name: "card",
        varName: "--card",
        textVarName: "--card-foreground",
        purpose: "Фон карточек и контейнеров контента.",
      },
      {
        name: "popover",
        varName: "--popover",
        textVarName: "--popover-foreground",
        purpose: "Фон выпадающих меню, тултипов и попапов.",
      },
      {
        name: "sidebar",
        varName: "--sidebar",
        textVarName: "--sidebar-foreground",
        purpose: "База боковой навигации.",
      },
      {
        name: "sidebar-primary",
        varName: "--sidebar-primary",
        textVarName: "--sidebar-primary-foreground",
        purpose: "Активный пункт в sidebar.",
      },
      {
        name: "sidebar-accent",
        varName: "--sidebar-accent",
        textVarName: "--sidebar-accent-foreground",
        purpose: "Hover/secondary акцент в sidebar.",
      },
    ],
  },
  {
    title: "Charts",
    tokens: [
      {
        name: "chart-1",
        varName: "--chart-1",
        textVarName: "--background",
        purpose: "Серия данных #1 на графиках.",
      },
      {
        name: "chart-2",
        varName: "--chart-2",
        textVarName: "--background",
        purpose: "Серия данных #2 на графиках.",
      },
      {
        name: "chart-3",
        varName: "--chart-3",
        textVarName: "--background",
        purpose: "Серия данных #3 на графиках.",
      },
      {
        name: "chart-4",
        varName: "--chart-4",
        textVarName: "--background",
        purpose: "Серия данных #4 на графиках.",
      },
      {
        name: "chart-5",
        varName: "--chart-5",
        textVarName: "--background",
        purpose: "Серия данных #5 на графиках.",
      },
    ],
  },
]

const lightThemeVars: Record<string, string> = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.145 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.145 0 0)",
  "--primary": "oklch(0.205 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.97 0 0)",
  "--secondary-foreground": "oklch(0.205 0 0)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--destructive": "oklch(0.704 0.191 22.216)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--chart-1": "oklch(0.488 0.243 264.376)",
  "--chart-2": "oklch(0.696 0.17 162.48)",
  "--chart-3": "oklch(0.769 0.188 70.08)",
  "--chart-4": "oklch(0.627 0.265 303.9)",
  "--chart-5": "oklch(0.645 0.246 16.439)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.145 0 0)",
  "--sidebar-primary": "oklch(0.488 0.243 264.376)",
  "--sidebar-primary-foreground": "oklch(0.985 0 0)",
  "--sidebar-accent": "oklch(0.97 0 0)",
  "--sidebar-accent-foreground": "oklch(0.205 0 0)",
  "--sidebar-border": "oklch(0.922 0 0)",
  "--sidebar-ring": "oklch(0.708 0 0)",
}

const darkThemeVars: Record<string, string> = {
  "--background": "oklch(0.145 0 0)",
  "--foreground": "oklch(0.985 0 0)",
  "--card": "oklch(0.205 0 0)",
  "--card-foreground": "oklch(0.985 0 0)",
  "--popover": "oklch(0.205 0 0)",
  "--popover-foreground": "oklch(0.985 0 0)",
  "--primary": "oklch(0.922 0 0)",
  "--primary-foreground": "oklch(0.205 0 0)",
  "--secondary": "oklch(0.269 0 0)",
  "--secondary-foreground": "oklch(0.985 0 0)",
  "--muted": "oklch(0.269 0 0)",
  "--muted-foreground": "oklch(0.708 0 0)",
  "--accent": "oklch(0.269 0 0)",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--destructive": "oklch(0.704 0.191 22.216)",
  "--border": "oklch(1 0 0 / 10%)",
  "--input": "oklch(1 0 0 / 15%)",
  "--ring": "oklch(0.556 0 0)",
  "--chart-1": "oklch(0.488 0.243 264.376)",
  "--chart-2": "oklch(0.696 0.17 162.48)",
  "--chart-3": "oklch(0.769 0.188 70.08)",
  "--chart-4": "oklch(0.627 0.265 303.9)",
  "--chart-5": "oklch(0.645 0.246 16.439)",
  "--sidebar": "oklch(0.205 0 0)",
  "--sidebar-foreground": "oklch(0.985 0 0)",
  "--sidebar-primary": "oklch(0.488 0.243 264.376)",
  "--sidebar-primary-foreground": "oklch(0.985 0 0)",
  "--sidebar-accent": "oklch(0.269 0 0)",
  "--sidebar-accent-foreground": "oklch(0.985 0 0)",
  "--sidebar-border": "oklch(1 0 0 / 10%)",
  "--sidebar-ring": "oklch(0.556 0 0)",
}

function Swatch({ token }: { token: ColorToken }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        background: "var(--card)",
      }}
    >
      <div
        style={{
          height: 68,
          backgroundColor: `var(${token.varName})`,
          color: token.textVarName ? `var(${token.textVarName})` : "var(--foreground)",
          display: "flex",
          alignItems: "center",
          paddingInline: 12,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        Aa
      </div>
      <div style={{ padding: 10, fontSize: 12, lineHeight: 1.4 }}>
        <div style={{ color: "var(--foreground)", fontWeight: 600 }}>{token.name}</div>
        <div style={{ color: "var(--muted-foreground)", fontFamily: "monospace" }}>{token.varName}</div>
        <div style={{ color: "var(--muted-foreground)", marginTop: 6 }}>{token.purpose}</div>
      </div>
    </div>
  )
}

function PaletteSection({ title, tokens }: ColorGroup) {
  return (
    <section style={{ marginBottom: 20 }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700 }}>{title}</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 10,
        }}
      >
        {tokens.map(token => (
          <Swatch key={token.name} token={token} />
        ))}
      </div>
    </section>
  )
}

function ThemePalette({ dark = false }: { dark?: boolean }) {
  return (
    <div
      style={{
        ...(dark ? darkThemeVars : lightThemeVars),
        background: "var(--background)",
        color: "var(--foreground)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 16,
      }}
    >
      <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800 }}>
        {dark ? "Dark theme" : "Light theme"}
      </h2>
      {colorGroups.map(group => (
        <PaletteSection key={group.title} title={group.title} tokens={group.tokens} />
      ))}
    </div>
  )
}

function TailwindPalettePage() {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
        padding: 16,
      }}
    >
      <ThemePalette />
      <ThemePalette dark />
    </div>
  )
}

const meta = {
  title: "Design/Color Palette",
  component: TailwindPalettePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TailwindPalettePage>

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {}
