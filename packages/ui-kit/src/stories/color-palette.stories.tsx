import type { Meta, StoryObj } from "@storybook/react"

type ColorToken = {
  name: string
  varName: string
  textVarName?: string
  purpose: string
}

const tokenRows: ColorToken[][] = [
  [
    { name: "primary", varName: "--primary", textVarName: "--primary-foreground", purpose: "Главные CTA и акценты." },
    { name: "secondary", varName: "--secondary", textVarName: "--secondary-foreground", purpose: "Вторичные действия." },
    { name: "accent", varName: "--accent", textVarName: "--accent-foreground", purpose: "Hover и выделения." },
    { name: "muted", varName: "--muted", textVarName: "--muted-foreground", purpose: "Приглушенные поверхности." },
    { name: "card", varName: "--card", textVarName: "--card-foreground", purpose: "Поверхности Paper/Modal." },
  ],
  [
    { name: "constructive", varName: "--constructive", textVarName: "--constructive-foreground", purpose: "Созидательные действия и позитивный flow." },
    { name: "cautionary", varName: "--cautionary", textVarName: "--cautionary-foreground", purpose: "Внимание и предостережение." },
    { name: "destructive", varName: "--destructive", textVarName: "--background", purpose: "Удаление и ошибки." },
  ],
  [
    { name: "chart-1", varName: "--chart-1", textVarName: "--background", purpose: "Серия #1." },
    { name: "chart-2", varName: "--chart-2", textVarName: "--background", purpose: "Серия #2." },
    { name: "chart-3", varName: "--chart-3", textVarName: "--background", purpose: "Серия #3." },
    { name: "chart-4", varName: "--chart-4", textVarName: "--background", purpose: "Серия #4." },
    { name: "chart-5", varName: "--chart-5", textVarName: "--background", purpose: "Серия #5." },
  ],
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
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--constructive": "#009635",
  "--constructive-foreground": "#ffffff",
  "--cautionary": "#fcd015",
  "--cautionary-foreground": "#111111",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--chart-1": "oklch(0.75 0.25 45)",
  "--chart-2": "oklch(0.6 0.118 184.704)",
  "--chart-3": "oklch(0.398 0.07 227.392)",
  "--chart-4": "oklch(0.828 0.189 84.429)",
  "--chart-5": "oklch(0.769 0.188 70.08)",
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
  "--accent": "oklch(0.371 0 0)",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--constructive": "#009635",
  "--constructive-foreground": "#ffffff",
  "--cautionary": "#fcd015",
  "--cautionary-foreground": "#111111",
  "--border": "oklch(1 0 0 / 10%)",
  "--input": "oklch(1 0 0 / 15%)",
  "--ring": "oklch(0.556 0 0)",
  "--chart-1": "oklch(0.75 0.25 45)",
  "--chart-2": "oklch(0.696 0.17 162.48)",
  "--chart-3": "oklch(0.769 0.188 70.08)",
  "--chart-4": "oklch(0.627 0.265 303.9)",
  "--chart-5": "oklch(0.645 0.246 16.439)",
}

function Swatch({ token, values }: { token: ColorToken; values: Record<string, string> }) {
  const tokenValue = values[token.varName] ?? `var(${token.varName})`

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <div
        style={{
          height: 54,
          backgroundColor: `var(${token.varName})`,
          color: token.textVarName ? `var(${token.textVarName})` : "var(--foreground)",
        }}
      />
      <div style={{ padding: 10, fontSize: 11, lineHeight: 1.3 }}>
        <div style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>{token.name}</div>
        <div style={{ color: "var(--muted-foreground)", fontFamily: "monospace", fontSize: 11 }}>
          {tokenValue}
        </div>
        <div style={{ color: "var(--muted-foreground)", marginTop: 4, fontSize: 11 }}>{token.purpose}</div>
      </div>
    </div>
  )
}

function TokenBlock({ values }: { values: Record<string, string> }) {
  return (
    <section style={{ borderTop: "1px solid var(--border)", padding: 12 }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700, letterSpacing: "0.06em" }}>TOKENS</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tokenRows.map((row, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
              gap: 10,
            }}
          >
            {row.map(token => (
              <Swatch key={token.name} token={token} values={values} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ThemePalette({ dark = false }: { dark?: boolean }) {
  const values = dark ? darkThemeVars : lightThemeVars

  return (
    <div
      style={{
        ...values,
        background: "var(--background)",
        color: "var(--foreground)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 14, fontSize: 24, fontWeight: 800, letterSpacing: "0.06em" }}>
        {dark ? "DARK .DARK" : "LIGHT :ROOT"}
      </div>
      <TokenBlock values={values} />
    </div>
  )
}

function TailwindPalettePage() {
  return (
    <div
      style={{
        background: "#f8fafc",
        color: "#0f172a",
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <h1 style={{ margin: "0 0 14px", fontSize: 34, fontWeight: 800, color: "#64748b" }}>
        Цветовая палитра из токенов (Light + Dark)
      </h1>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
          alignItems: "start",
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <ThemePalette />
        <ThemePalette dark />
      </div>
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
