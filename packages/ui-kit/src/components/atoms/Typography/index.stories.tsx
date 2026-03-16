import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { Paper } from '@/components/atoms/Paper'
import {
  getDefaultColorByTypography,
  getDefaultElementTagByTypography,
  Typography,
  TYPOGRAPHY_COLOR_OPTIONS,
  type TypographyColorType,
  type TypographyType,
} from '@/components/atoms/Typography'

const elementOptions = [
  'auto',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'p',
  'span',
  'div',
] as const

const textWrapStylesDictionary = {
  wrap: {
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
  'pre-wrap': {
    whiteSpace: 'pre-wrap',
  },
  'break-word': {
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
  },
  'break-all': {
    whiteSpace: 'normal',
    wordBreak: 'break-all',
  },
  anywhere: {
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  },
} as const satisfies Record<string, CSSProperties>

type TypographyVariantType = {
  label: string
  type: TypographyType
  sample: string
  usage: string
}

const typographyVariants: TypographyVariantType[] = [
  {
    label: 'Heading',
    type: 'Heading',
    sample: 'Infinity Loop primary heading preview text with wrapping behavior.',
    usage: 'Использовать для главных заголовков экранов и крупных секций.',
  },
  {
    label: 'Section Header',
    type: 'SectionHeader',
    sample: 'Infinity Loop section header preview text with wrapping behavior.',
    usage: 'Использовать для заголовков блоков внутри страницы.',
  },
  {
    label: 'Compact Header',
    type: 'CompactHeader',
    sample: 'Infinity Loop compact header preview text with wrapping behavior.',
    usage: 'Использовать для компактных заголовков карточек и небольших групп.',
  },
  {
    label: 'Action',
    type: 'Action',
    sample: 'Infinity Loop action preview text with wrapping behavior.',
    usage: 'Использовать для кнопок, ссылок и прочих action-элементов.',
  },
  {
    label: 'Subheader',
    type: 'Subheader',
    sample: 'Infinity Loop supporting subheader preview text with wrapping behavior.',
    usage: 'Использовать для основного поддерживающего текста и описаний.',
  },
  {
    label: 'Body',
    type: 'Body',
    sample: 'Infinity Loop body text placeholder for regular reading content.',
    usage:
      'Использовать как базовый body-текст (черновая заготовка, финальные параметры уточняются).',
  },
  {
    label: 'Body Small',
    type: 'BodySmall',
    sample: 'Infinity Loop body small text for hints and supporting details.',
    usage: 'Использовать для пояснений, helper-текста и вторичных описаний.',
  },
  {
    label: 'Caption',
    type: 'Caption',
    sample: 'Infinity Loop caption preview text with wrapping behavior.',
    usage: 'Использовать для подписи, служебного текста и коротких меток.',
  },
  {
    label: 'Compact Caption',
    type: 'CompactCaption',
    sample: 'Infinity Loop compact caption preview text with wrapping behavior.',
    usage: 'Использовать для плотных подписей и вторичных компактных пояснений.',
  },
]

const meta = {
  title: 'Design/Typography',
  component: Typography,
  tags: ['autodocs'],
  render: args => {
    const colorArg = args.color as TypographyColorType | undefined
    const elementArg = args.element as
      | (typeof elementOptions)[number]
      | undefined
    const resolvedElement = elementArg === 'auto' ? undefined : elementArg

    return (
      <div className="w-[640px] max-w-full space-y-3">
        {typographyVariants.map(variant => {
          const defaultTag = getDefaultElementTagByTypography(variant.type)
          const resolvedTag = resolvedElement ?? defaultTag
          const defaultColor = getDefaultColorByTypography(variant.type)
          const resolvedColor = colorArg ?? defaultColor
          const previewClassName = [
            args.className,
            args.isLoading ? 'block w-full' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <Paper key={variant.type} type="dark" className="space-y-2">
              <Typography typography="CompactCaption" className="normal-case">
                {variant.label}
              </Typography>

              <Typography
                {...args}
                typography={variant.type}
                element={resolvedElement}
                color={resolvedColor}
                className={previewClassName || undefined}>
                {variant.sample}
              </Typography>

              <Typography typography="BodySmall">
                {variant.usage}
              </Typography>

              <ul
                className="list-disc space-y-1 pl-5"
                style={{ color: 'var(--muted-foreground)' }}>
                <li style={{ color: 'var(--chart-1)' }}>
                  <Typography
                    typography="CompactCaption"
                    element="span"
                    color="chart-1"
                    className="normal-case">
                    {resolvedTag}
                  </Typography>
                </li>
                <li>
                  <Typography
                    typography="CompactCaption"
                    element="span"
                    color={resolvedColor}
                    className="normal-case">
                    {resolvedColor}
                  </Typography>
                </li>
              </ul>
            </Paper>
          )
        })}
      </div>
    )
  },
  args: {
    typography: 'Heading',
    element: undefined,
    isLoading: false,
    color: undefined,
    style: textWrapStylesDictionary.wrap,
    className: '',
  },
  argTypes: {
    element: {
      control: 'select',
      options: elementOptions,
    },
    isLoading: {
      control: 'boolean',
    },
    color: {
      control: 'select',
      options: TYPOGRAPHY_COLOR_OPTIONS,
    },
    style: {
      name: 'textWrap',
      control: 'select',
      options: Object.keys(textWrapStylesDictionary),
      mapping: textWrapStylesDictionary,
    },
    className: {
      control: 'text',
    },
    children: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Typography>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
