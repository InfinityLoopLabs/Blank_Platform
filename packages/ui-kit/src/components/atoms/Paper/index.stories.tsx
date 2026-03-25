import type { Meta, StoryObj } from '@storybook/react-vite'

import { Paper, PAPER_PATTERN_COLOR_OPTIONS } from '@/components/atoms/Paper'
import { Typography } from '@/components/atoms/Typography'

const defaultPatternIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4L20 12L12 20L4 12L12 4Z" fill="currentColor"/></svg>`
const lucideAsteriskPatternIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="m8 6 8 12"/><path d="m16 6-8 12"/><path d="M4 12h16"/></svg>`
const lucideSparklePatternIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M12 3l1.95 5.05L19 10l-5.05 1.95L12 17l-1.95-5.05L5 10l5.05-1.95L12 3z"/></svg>`

const meta = {
  title: 'Atoms/Paper',
  component: Paper,
  tags: ['autodocs'],
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
    isRoundedCornersDisabled: false,
    isLoading: false,
    patternIcon: defaultPatternIcon,
    patternColor: 'chart-1',
    patternAngle: 24,
    patternSize: 34,
    patternOpacity: 0.1,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['dark', 'light', 'gradient'],
    },
    isColored: {
      control: 'boolean',
    },
    isRoundedCornersDisabled: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    patternIcon: {
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
    patternIcon: lucideAsteriskPatternIcon,
    patternColor: 'chart-2',
    patternAngle: 28,
    patternSize: 32,
    patternOpacity: 0.2,
  },
}

export const LucideSparklePattern: StoryType = {
  args: {
    patternIcon: lucideSparklePatternIcon,
    patternColor: 'chart-4',
    patternAngle: 18,
    patternSize: 30,
    patternOpacity: 0.18,
  },
}
