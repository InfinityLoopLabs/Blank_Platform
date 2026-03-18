import type { Meta, StoryObj } from '@storybook/react'

import {
  darkThemeVars,
  lightThemeVars,
  projectColorTokenRows,
  type ColorTokenType,
} from '@/showcase/design-tokens'

function Swatch({
  token,
  values,
}: {
  token: ColorTokenType
  values: Record<string, string>
}) {
  const tokenValue = values[token.varName] ?? `var(${token.varName})`

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'transparent',
      }}>
      <div
        style={{
          height: 54,
          backgroundColor: `var(${token.varName})`,
          color: token.textVarName
            ? `var(${token.textVarName})`
            : 'var(--foreground)',
        }}
      />
      <div
        style={{
          padding: 10,
          fontSize: 11,
          lineHeight: 1.3,
        }}>
        <div
          style={{
            color: 'var(--foreground)',
            fontWeight: 700,
            fontSize: 14,
          }}>
          {token.name}
        </div>
        <div
          style={{
            color: 'var(--muted-foreground)',
            fontFamily: 'monospace',
            fontSize: 11,
          }}>
          {tokenValue}
        </div>
        <div
          style={{
            color: 'var(--muted-foreground)',
            marginTop: 4,
            fontSize: 11,
          }}>
          {token.purpose}
        </div>
      </div>
    </div>
  )
}

function TokenBlock({ values }: { values: Record<string, string> }) {
  return (
    <section
      style={{
        borderTop: '1px solid var(--border)',
        padding: 12,
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
        {projectColorTokenRows.map((row, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
              gap: 10,
            }}>
            {row.map(token => (
              <Swatch key={token.name} token={token} values={values} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ThemePalette({ isDark = false }: { isDark?: boolean }) {
  const values = isDark ? darkThemeVars : lightThemeVars

  return (
    <div
      style={{
        ...values,
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        overflow: 'hidden',
      }}>
      <TokenBlock values={values} />
    </div>
  )
}

function TailwindPalettePage() {
  return (
    <div
      style={{
        background: '#f8fafc',
        color: '#0f172a',
        minHeight: '100vh',
        padding: 16,
      }}>
      <h1
        style={{
          margin: '0 0 14px',
          fontSize: 34,
          fontWeight: 800,
          color: '#64748b',
        }}>
        Цветовая палитра проекта
      </h1>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
          alignItems: 'start',
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
        }}>
        <ThemePalette />
        <ThemePalette isDark />
      </div>
    </div>
  )
}

const meta = {
  title: 'Design/Color Palette',
  component: TailwindPalettePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TailwindPalettePage>

export default meta

type StoryType = StoryObj<typeof meta>

export const Palette: StoryType = {}
