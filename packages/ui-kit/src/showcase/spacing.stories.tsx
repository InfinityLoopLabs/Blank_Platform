import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

type RuleType = {
  title: string
  description: string
}

type ScaleItemType = {
  token: string
  px: string
  usage: string
}

type ExampleType = {
  scenario: string
  classes: string
  note: string
}

type GridRuleType = {
  viewport: string
  columns: number
  gutter: string
  margin: string
  container: string
}

type DesktopSkeletonType = {
  name: string
  classes: string
  structure: string
}

const rules: RuleType[] = [
  {
    title: 'База 8px',
    description:
      'Основной ритм интерфейса строим на шагах 8px: 8, 16, 24, 32, 40, 48, 64. Для оптических случаев допускаем 4 и 12.',
  },
  {
    title: 'Tailwind defaults',
    description:
      'Используем стандартные spacing-классы Tailwind (`p-2`, `m-4`, `gap-3`) без кастомных токенов.',
  },
  {
    title: 'Одна шкала для всего',
    description:
      'Padding, margin и gap должны жить в одной шкале, чтобы интерфейс оставался консистентным.',
  },
]

const scale: ScaleItemType[] = [
  {
    token: '1',
    px: '4px',
    usage: 'Микро-отступы (иконка + текст).',
  },
  {
    token: '2',
    px: '8px',
    usage: 'Базовый внутренний шаг.',
  },
  {
    token: '3',
    px: '12px',
    usage: 'Оптический шаг между плотными элементами.',
  },
  {
    token: '4',
    px: '16px',
    usage: 'Типичный padding карточек/блоков.',
  },
  {
    token: '6',
    px: '24px',
    usage: 'Интервалы между секциями в одном экране.',
  },
  {
    token: '8',
    px: '32px',
    usage: 'Крупные секционные отступы.',
  },
  {
    token: '10',
    px: '40px',
    usage: 'Крупные интервалы между блоками на desktop.',
  },
  {
    token: '12',
    px: '48px',
    usage: 'Разделение больших смысловых секций.',
  },
  {
    token: '16',
    px: '64px',
    usage: 'Макро-отступ для hero/разделов верхнего уровня.',
  },
]

const examples: ExampleType[] = [
  {
    scenario: 'Карточка',
    classes: 'p-4 gap-3',
    note: '16px снаружи, 12px между внутренними элементами.',
  },
  {
    scenario: 'Форма',
    classes: 'space-y-4',
    note: 'Стандартный вертикальный ритм между полями.',
  },
  {
    scenario: 'Layout-контейнер',
    classes: 'px-6 py-4',
    note: 'Горизонтальный отступ больше, вертикальный компактнее.',
  },
  {
    scenario: 'Ряд кнопок',
    classes: 'gap-2',
    note: '8px чаще всего достаточно для action-группы.',
  },
  {
    scenario: 'Крупный раздел',
    classes: 'py-16',
    note: '64px для выраженного вертикального ритма между большими секциями.',
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

const desktopSkeletons: DesktopSkeletonType[] = [
  {
    name: 'Dashboard',
    classes: 'grid grid-cols-12 gap-6 px-8 py-6',
    structure: 'Sidebar 3 / Main 9',
  },
  {
    name: 'Content + Aside',
    classes: 'grid grid-cols-12 gap-8 px-10 py-8',
    structure: 'Main 8 / Aside 4',
  },
  {
    name: 'Workspace',
    classes: 'grid grid-cols-12 gap-6 px-8 py-6',
    structure: 'Nav 2 / Main 7 / Inspector 3',
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

function SpacingGuide() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--foreground)',
        padding: 24,
      }}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: 1100,
          display: 'grid',
          gap: 20,
        }}
      >
        <header
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            background: 'color-mix(in oklab, var(--card) 95%, black 5%)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: 'var(--muted-foreground)',
            }}
          >
            Design Guide
          </p>
          <h1
            style={{
              margin: '8px 0 0',
              fontSize: 32,
              lineHeight: 1.15,
            }}
          >
            Spacing
          </h1>
          <p
            style={{
              margin: '12px 0 0',
              maxWidth: 860,
              color: 'var(--muted-foreground)',
            }}
          >
            Короткий практический гайд: как использовать spacing в UI Kit и зачем это нужно для
            визуального ритма, читаемости и консистентности.
          </p>
        </header>

        <section
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            background: 'var(--card)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            Для чего spacing
          </h2>
          <ul
            style={{
              margin: '12px 0 0',
              paddingLeft: 18,
              display: 'grid',
              gap: 8,
              listStyle: 'disc',
            }}
          >
            <li>Управляет визуальной иерархией: важные блоки получают больше воздуха.</li>
            <li>Улучшает читаемость: текст и controls не слипаются.</li>
            <li>Делает интерфейс предсказуемым: одинаковые паттерны = одинаковые расстояния.</li>
          </ul>
        </section>

        <section
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            background: 'var(--card)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            Правила
          </h2>
          <div
            style={{
              marginTop: 12,
              display: 'grid',
              gap: 10,
            }}
          >
            {rules.map(rule => (
              <div
                key={rule.title}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <strong>{rule.title}</strong>
                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {rule.description}
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
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            Grid в layout
          </h2>
          <div
            style={{
              marginTop: 12,
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 760,
              }}
            >
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
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            Desktop скелеты
          </h2>
          <div
            style={{
              marginTop: 12,
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 760,
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Шаблон</th>
                  <th style={tableHeaderStyle}>Классы</th>
                  <th style={tableHeaderStyle}>Колонки</th>
                </tr>
              </thead>
              <tbody>
                {desktopSkeletons.map(item => (
                  <tr key={item.name}>
                    <td style={tableCellStyle}>{item.name}</td>
                    <td style={tableCellStyle}>
                      <code>{item.classes}</code>
                    </td>
                    <td style={tableCellStyle}>{item.structure}</td>
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
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            Базовая шкала
          </h2>
          <div
            style={{
              marginTop: 12,
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 700,
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Класс</th>
                  <th style={tableHeaderStyle}>Размер</th>
                  <th style={tableHeaderStyle}>Когда использовать</th>
                </tr>
              </thead>
              <tbody>
                {scale.map(item => (
                  <tr key={item.token}>
                    <td style={tableCellStyle}>
                      <code>{`*-${item.token}`}</code>
                    </td>
                    <td style={tableCellStyle}>{item.px}</td>
                    <td style={tableCellStyle}>{item.usage}</td>
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
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            Практика
          </h2>
          <div
            style={{
              marginTop: 12,
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 760,
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Сценарий</th>
                  <th style={tableHeaderStyle}>Классы</th>
                  <th style={tableHeaderStyle}>Пояснение</th>
                </tr>
              </thead>
              <tbody>
                {examples.map(example => (
                  <tr key={example.scenario}>
                    <td style={tableCellStyle}>{example.scenario}</td>
                    <td style={tableCellStyle}>
                      <code>{example.classes}</code>
                    </td>
                    <td style={tableCellStyle}>{example.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

const meta = {
  title: 'Design/Spacing',
  component: SpacingGuide,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SpacingGuide>

export default meta

type StoryType = StoryObj<typeof meta>

export const Guide: StoryType = {}
