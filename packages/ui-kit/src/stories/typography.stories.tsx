import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import { Typography, type TypographyType } from '@/components/atoms/Typography'

type TypographyVariantType = {
  label: string
  type: TypographyType
  sample: string
}

const typographyVariants: TypographyVariantType[] = [
  {
    label: 'Button text',
    type: 'ButtonLabel',
    sample: 'Button',
  },
  {
    label: 'Input placeholder',
    type: 'InputPlaceholder',
    sample: 'Input placeholder type here',
  },
]

function TypographyPreview() {
  return (
    <div className="w-[640px] max-w-full space-y-3">
      {typographyVariants.map(variant => (
        <Paper key={variant.type} type="dark" className="space-y-2">
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
            {variant.label}
          </p>
          <Typography typography={variant.type}>{variant.sample}</Typography>
        </Paper>
      ))}
    </div>
  )
}

const meta = {
  title: 'Design/Typography',
  component: TypographyPreview,
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyPreview>

export default meta
type StoryType = StoryObj<typeof meta>

export const Primary: StoryType = {}
