import type { Meta, StoryObj } from "@storybook/react"

const typographyScale = [
  {
    token: "hero",
    sample: "The Future Is Set in Type",
  },
  {
    token: "subhero",
    sample: "Expressive serif accents with a calm sans system",
  },
  {
    token: "h2",
    sample: "Section heading with editorial contrast",
  },
  {
    token: "h3",
    sample: "Subheading for cards and navigation",
  },
  {
    token: "body",
    sample:
      "Body copy stays highly readable while display text carries the brand voice. This mix is now one of the strongest directions for modern UI typography.",
  },
  {
    token: "caption",
    sample: "Signal label / metadata",
  },
  {
    token: "code",
    sample: "font-variation-settings: \"opsz\" 72, \"wght\" 700;",
  },
]

function TypographyScalePreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(120% 140% at 100% 0%, color-mix(in oklab, var(--chart-1) 22%, transparent), transparent 45%), var(--background)",
        color: "var(--foreground)",
        padding: "clamp(16px, 2.4vw, 36px)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gap: 28,
        }}
      >
        <header
          style={{
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "clamp(18px, 3vw, 36px)",
            background: "color-mix(in oklab, var(--card) 92%, transparent)",
            display: "grid",
            gap: 14,
          }}
        >
          <span className="kicker" style={{ color: "var(--muted-foreground)" }}>
            Typography Trend 2026
          </span>
          <h1 className="hero">Expressive Editorial Contrast</h1>
          <p className="subhero" style={{ color: "var(--muted-foreground)" }}>
            Oversized display serif for tone, neutral sans for product readability, fluid clamp scale for responsive rhythm.
          </p>
        </header>

        <section
          style={{
            border: "1px solid var(--border)",
            borderRadius: 18,
            overflow: "hidden",
            background: "var(--card)",
          }}
        >
          {typographyScale.map(item => (
            <div
              key={item.token}
              style={{
                display: "grid",
                gap: 8,
                padding: "clamp(14px, 1.6vw, 22px)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="caption" style={{ color: "var(--muted-foreground)" }}>
                {item.token}
              </div>
              <div className={item.token}>{item.sample}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

const meta = {
  title: "Design/Typography Trend",
  component: TypographyScalePreview,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TypographyScalePreview>

export default meta
type Story = StoryObj<typeof meta>

export const EditorialContrast: Story = {}
