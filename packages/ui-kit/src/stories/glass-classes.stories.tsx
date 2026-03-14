import type { Meta, StoryObj } from "@storybook/react"

import {
  FAST_TRANSITION_CLASS,
  GLASS_CLASS,
  GLASS_SURFACE_CLASS,
  HIDDEN_BY_SCROLL_CLASS,
} from "@/constants"

type GlassTokenType = {
  name: string
  value: string
  purpose: string
  previewClassName: string
  previewText: string
}

const classTokens: GlassTokenType[] = [
  {
    name: "GLASS_SURFACE_CLASS",
    value: GLASS_SURFACE_CLASS,
    purpose: "Готовая стеклянная поверхность (фон + border + blur).",
    previewClassName: `${GLASS_SURFACE_CLASS} rounded-xl px-4 py-3`,
    previewText: "Toolbar / Panel surface",
  },
  {
    name: "GLASS_CLASS",
    value: GLASS_CLASS,
    purpose: "Только glass-слой: blur + прозрачность (без базовой заливки).",
    previewClassName: `${GLASS_CLASS} rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-white`,
    previewText: "Glass layer",
  },
]

function Row({ token }: { token: GlassTokenType }) {
  const isGlassLikeToken =
    token.name === "GLASS_CLASS" || token.name === "GLASS_SURFACE_CLASS"

  return (
    <div className="rounded-(--radius) border border-(--border) bg-(--card) p-5">
      <div className="mb-2 text-sm font-semibold">{token.name}</div>
      <div className="mb-3 rounded-md bg-(--muted) p-2 font-mono text-xs text-(--muted-foreground)">
        {token.value}
      </div>
      <div className="mb-4 text-xs text-(--muted-foreground)">{token.purpose}</div>
      <div className={isGlassLikeToken ? "rounded-xl border border-red-500/60 bg-red-500 p-3" : ""}>
        <div className={token.previewClassName}>
          <span className="text-sm">{token.previewText}</span>
        </div>
      </div>
    </div>
  )
}

function CustomCssPage() {
  return (
    <div className="min-h-screen bg-(--background) p-6 text-(--foreground)">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold">Custom CSS</h1>
        <p className="text-sm text-(--muted-foreground)">
          Эти константы можно импортировать из <code>@infinityloop.labs/ui-kit</code> и использовать
          в любом проекте.
        </p>
        <div className="grid gap-4">
          {classTokens.map(token => (
            <Row key={token.name} token={token} />
          ))}
        </div>
        <div className="rounded-(--radius) border border-(--border) bg-(--card) p-4">
          <p className="mb-2 text-sm font-semibold">Support Classes</p>
          <div className="space-y-2 text-xs text-(--muted-foreground)">
            <div>
              <span className="font-mono text-(--foreground)">FAST_TRANSITION_CLASS</span>:{" "}
              {FAST_TRANSITION_CLASS}
            </div>
            <button
              type="button"
              className={`${FAST_TRANSITION_CLASS} mt-1 rounded-lg border border-(--border) bg-(--background) px-3 py-2 text-xs hover:scale-[1.02] hover:bg-(--muted)`}
            >
              Hover me (transition demo)
            </button>
            <div>
              <span className="font-mono text-(--foreground)">HIDDEN_BY_SCROLL_CLASS</span>:{" "}
              {HIDDEN_BY_SCROLL_CLASS}
            </div>
            <div className={`${HIDDEN_BY_SCROLL_CLASS} rounded bg-(--muted) px-2 py-1`}>
              Hidden by class demo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: "Design/Custom CSS",
  component: CustomCssPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CustomCssPage>

export default meta
type Story = StoryObj<typeof meta>

export const Classes: Story = {}
