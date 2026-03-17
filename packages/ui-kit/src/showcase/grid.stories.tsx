import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

type GridRuleType = {
  viewport: string
  columns: number
  gutter: string
  margin: string
  container: string
}

type DecisionItemType = {
  title: string
  description: string
}

const decisionItems: DecisionItemType[] = [
  {
    title: 'База кратности 8',
    description:
      'Отступы в layout и компонентах держим в шаге 8px. Для оптических случаев допустимы 4px и 12px.',
  },
  {
    title: 'Grid-first подход',
    description:
      'Сначала определяем колонки, gutter и внешние поля; потом раскладываем компоненты внутри.',
  },
  {
    title: 'Tailwind defaults',
    description:
      'Используем стандартные классы `p-2`, `p-4`, `gap-3`, `m-6` без кастомных spacing-токенов.',
  },
]

const gridRules: GridRuleType[] = [
  {
    viewport: 'Mobile (до 767px)',
    columns: 4,
    gutter: '16px',
    margin: '16px',
    container: 'Fluid',
  },
  {
    viewport: 'Tablet (768px - 1279px)',
    columns: 8,
    gutter: '24px',
    margin: '24px',
    container: 'Fluid',
  },
  {
    viewport: 'Desktop (1280px+)',
    columns: 12,
    gutter: '24px',
    margin: '32px',
    container: 'max-width 1440px',
  },
]

const tableHeaderStyle: CSSProperties = {
  borderBottom: '1px solid var(--border)',
  textAlign: 'left',
  fontSize: 12,
  color: 'var(--muted-foreground)',
  padding: '10px 12px',
}

const tableCellStyle: CSSProperties = {
  borderBottom: '1px solid var(--border)',
  textAlign: 'left',
  verticalAlign: 'top',
  padding: '10px 12px',
  lineHeight: 1.45,
}

function GridArticle() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--foreground)',
        padding: 24,
      }}>
      <div
        style={{
          margin: '0 auto',
          maxWidth: 1100,
          display: 'grid',
          gap: 20,
        }}>
        <header
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            background: 'color-mix(in oklab, var(--card) 95%, black 5%)',
          }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: 'var(--muted-foreground)',
            }}>
            Design Decision Draft
          </p>
          <h1 style={{ margin: '8px 0 0',
fontSize: 32,
lineHeight: 1.15 }}>
            Layout Grid
          </h1>
          <p
            style={{
              margin: '12px 0 0',
              maxWidth: 880,
              color: 'var(--muted-foreground)',
            }}>
            Фиксируем правила сетки для UI Kit: количество колонок по
            брейкпоинтам, gutter, внешние поля и базовый ритм 8px.
          </p>
        </header>

        <section
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            background: 'var(--card)',
          }}>
          <h2 style={{ margin: 0,
fontSize: 22 }}>Правила</h2>
          <div style={{ marginTop: 12,
display: 'grid',
gap: 10 }}>
            {decisionItems.map(item => (
              <div
                key={item.title}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 12,
                }}>
                <strong>{item.title}</strong>
                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'var(--muted-foreground)',
                  }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            background: 'var(--card)',
          }}>
          <h2 style={{ margin: 0,
fontSize: 22 }}>Grid по брейкпоинтам</h2>
          <div style={{ marginTop: 12,
overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 760,
              }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Viewport</th>
                  <th style={tableHeaderStyle}>Колонки</th>
                  <th style={tableHeaderStyle}>Gutter</th>
                  <th style={tableHeaderStyle}>Margin</th>
                  <th style={tableHeaderStyle}>Container</th>
                </tr>
              </thead>
              <tbody>
                {gridRules.map(rule => (
                  <tr key={rule.viewport}>
                    <td style={tableCellStyle}>{rule.viewport}</td>
                    <td style={tableCellStyle}>{rule.columns}</td>
                    <td style={tableCellStyle}>{rule.gutter}</td>
                    <td style={tableCellStyle}>{rule.margin}</td>
                    <td style={tableCellStyle}>{rule.container}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            background: 'var(--card)',
          }}>
          <h2 style={{ margin: 0,
fontSize: 22 }}>Пример применения</h2>
          <pre
            style={{
              margin: '12px 0 0',
              background: 'color-mix(in oklab, var(--card) 90%, black 10%)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 12,
              overflowX: 'auto',
            }}>
            <code>{`<div className="grid grid-cols-12 gap-6 px-8">
  <aside className="col-span-3" />
  <main className="col-span-9" />
</div>`}</code>
          </pre>
        </section>
      </div>
    </div>
  )
}

const meta = {
  title: 'Design/Grid',
  component: GridArticle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GridArticle>

export default meta

type StoryType = StoryObj<typeof meta>

export const Article: StoryType = {}
