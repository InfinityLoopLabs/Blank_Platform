import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import { Typography, type TypographyType } from '@/components/atoms/Typography'

type TypographyVariantType = {
  label: string
  type: TypographyType
  sample: string
  usage: string
}

const typographyVariants: TypographyVariantType[] = [
  {
    label: 'Action',
    type: 'Action',
    sample: 'Infinity Loop Launch Control',
    usage:
      'Использовать для action-текста: кнопки, компактные интерактивные элементы.',
  },
  {
    label: 'Subheader',
    type: 'Subheader',
    sample: 'Infinity Loop subheader and helper copy',
    usage:
      'Использовать для supporting-контента: subheader, placeholder, helper text.',
  },
  {
    label: 'Caption',
    type: 'Caption',
    sample: 'Infinity Loop photo caption',
    usage: 'Использовать для подписей: caption, tagline, label над контентом.',
  },
]

function TypographyShowcase() {
  return (
    <div className="w-[640px] max-w-full space-y-3">
      {typographyVariants.map(variant => (
        <Paper key={variant.type} type="dark" className="space-y-2">
          <Typography typography="Caption" element="p">
            {variant.label}
          </Typography>
          <Typography typography={variant.type}>{variant.sample}</Typography>
          <p className="text-sm text-muted-foreground">{variant.usage}</p>
        </Paper>
      ))}
    </div>
  )
}

const meta = {
  title: 'Design/Typography',
  component: Typography,
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>

export default meta
type StoryType = StoryObj<typeof meta>

export const Guide: StoryType = {
  render: () => <TypographyShowcase />,
}

export const Action: StoryType = {
  args: {
    typography: 'Action',
    children: 'Infinity Loop Launch Control',
  },
  parameters: {
    docs: {
      source: {
        code: '<Typography typography="Action">Infinity Loop Launch Control</Typography>',
      },
    },
  },
}

export const Subheader: StoryType = {
  args: {
    typography: 'Subheader',
    children: 'Infinity Loop subheader and helper copy',
  },
  parameters: {
    docs: {
      source: {
        code: '<Typography typography="Subheader">Infinity Loop subheader and helper copy</Typography>',
      },
    },
  },
}

export const Caption: StoryType = {
  args: {
    typography: 'Caption',
    children: 'Infinity Loop photo caption',
  },
  parameters: {
    docs: {
      source: {
        code: '<Typography typography="Caption">Infinity Loop photo caption</Typography>',
      },
    },
  },
}
