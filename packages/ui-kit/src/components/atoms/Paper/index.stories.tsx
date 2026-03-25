import type { Meta, StoryObj } from '@storybook/react-vite'
import { Asterisk, Castle, Sparkles } from 'lucide-react'

import {
  Paper,
  PAPER_PATTERN_COLOR_OPTIONS,
  PAPER_RADIUS_CLASS_OPTIONS,
} from '@/components/atoms/Paper'
import { Typography } from '@/components/atoms/Typography'

const meta = {
  title: 'Atoms/Paper',
  component: Paper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TypeScript: `PaperPropertyType` включает `isGradientEnabled?: boolean`, `isBorderDisabled?: boolean`, `isPaddingDisabled?: boolean`, `radiusClassName?: PaperRadiusClassType`.',
      },
    },
  },
  render: args => (
    <Paper {...args}>
      <div className="space-y-2">
        <Typography
          typography="Heading"
          element="h4"
          isLoading={Boolean(args.isLoading)}>
          Infinity Loop Surface Title
        </Typography>
        <Typography
          typography="Subheader"
          element="p"
          isLoading={Boolean(args.isLoading)}>
          This content is controlled by Paper storybook controls.
        </Typography>
      </div>
    </Paper>
  ),
  args: {
    className: 'w-[600px]',
    type: 'dark',
    isColored: false,
    isGradientEnabled: false,
    isBorderDisabled: false,
    isPaddingDisabled: false,
    radiusClassName: 'rounded-(--radius)',
    isRoundedCornersDisabled: false,
    isLoading: false,
    patternIconComponent: Castle,
    patternIconFile: '',
    patternColor: 'chart-1',
    patternAngle: 24,
    patternSize: 34,
    patternGap: 0,
    patternOpacity: 0.1,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['dark', 'light', 'glass', 'transparent'],
    },
    isColored: {
      control: 'boolean',
    },
    isGradientEnabled: {
      control: 'boolean',
    },
    isBorderDisabled: {
      control: 'boolean',
    },
    isPaddingDisabled: {
      control: 'boolean',
    },
    radiusClassName: {
      control: 'select',
      options: PAPER_RADIUS_CLASS_OPTIONS,
    },
    isRoundedCornersDisabled: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    patternIconFile: {
      control: 'text',
    },
    patternAngle: {
      control: 'number',
    },
    patternColor: {
      control: 'select',
      options: PAPER_PATTERN_COLOR_OPTIONS,
    },
    patternSize: {
      control: 'number',
    },
    patternGap: {
      control: 'number',
    },
    patternOpacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  },
} satisfies Meta<typeof Paper>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}

export const LucideAsteriskPattern: StoryType = {
  args: {
    patternIconComponent: Asterisk,
    patternColor: 'chart-2',
    patternAngle: 28,
    patternSize: 32,
    patternOpacity: 0.2,
  },
}

export const LucideSparklePattern: StoryType = {
  args: {
    patternIconComponent: Sparkles,
    patternColor: 'chart-4',
    patternAngle: 18,
    patternSize: 30,
    patternOpacity: 0.18,
  },
}

export const TransparentNoPadding: StoryType = {
  args: {
    type: 'transparent',
    isPaddingDisabled: true,
    patternIconComponent: undefined,
    patternIconFile: '',
  },
}
