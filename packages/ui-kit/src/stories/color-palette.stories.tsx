import type { Meta, StoryObj } from "@storybook/react"

type ColorToken = {
  name: string
  varName: string
  textVarName?: string
}

type ColorGroup = {
  title: string
  tokens: ColorToken[]
}

const colorGroups: ColorGroup[] = [
  {
    title: "Base",
    tokens: [
      { name: "background", varName: "--background", textVarName: "--foreground" },
      { name: "foreground", varName: "--foreground", textVarName: "--background" },
      { name: "border", varName: "--border", textVarName: "--foreground" },
      { name: "input", varName: "--input", textVarName: "--foreground" },
      { name: "ring", varName: "--ring", textVarName: "--background" },
    ],
  },
  {
    title: "Semantic",
    tokens: [
      { name: "primary", varName: "--primary", textVarName: "--primary-foreground" },
      { name: "secondary", varName: "--secondary", textVarName: "--secondary-foreground" },
      { name: "muted", varName: "--muted", textVarName: "--muted-foreground" },
      { name: "accent", varName: "--accent", textVarName: "--accent-foreground" },
      { name: "destructive", varName: "--destructive", textVarName: "--background" },
    ],
  },
  {
    title: "Surface",
    tokens: [
      { name: "card", varName: "--card", textVarName: "--card-foreground" },
      { name: "popover", varName: "--popover", textVarName: "--popover-foreground" },
      { name: "sidebar", varName: "--sidebar", textVarName: "--sidebar-foreground" },
      { name: "sidebar-primary", varName: "--sidebar-primary", textVarName: "--sidebar-primary-foreground" },
      { name: "sidebar-accent", varName: "--sidebar-accent", textVarName: "--sidebar-accent-foreground" },
    ],
  },
  {
    title: "Charts",
    tokens: [
      { name: "chart-1", varName: "--chart-1", textVarName: "--background" },
      { name: "chart-2", varName: "--chart-2", textVarName: "--background" },
      { name: "chart-3", varName: "--chart-3", textVarName: "--background" },
      { name: "chart-4", varName: "--chart-4", textVarName: "--background" },
      { name: "chart-5", varName: "--chart-5", textVarName: "--background" },
    ],
  },
]

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
      className={dark ? "dark" : undefined}
      style={{
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
