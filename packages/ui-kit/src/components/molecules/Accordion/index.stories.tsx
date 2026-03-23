import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'

import {
  Typography,
  TYPOGRAPHY_COLOR_OPTIONS,
  TYPOGRAPHY_OPTIONS,
} from '@/components/atoms/Typography'
import {
  ACCORDION_PAPER_TYPE_OPTIONS,
  Accordion,
} from '@/components/molecules/Accordion'

const meta = {
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[560px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'What is Infinity Loop UI Kit?',
    content:
      'Infinity Loop UI Kit is a token-driven component library. This accordion uses design tokens for typography, colors and spacing.',
    isOpen: false,
    isLoading: false,
    isToggleDisabled: false,
    isEditModeEnabled: false,
    isEditModeDisabled: false,
    titleTypography: 'SectionHeader',
    contentTypography: 'BodySmall',
    titleColor: undefined,
    contentColor: undefined,
    paperType: 'dark',
    isPaperColored: false,
    isRoundedCornersDisabled: false,
  },
  argTypes: {
    title: {
      control: 'text',
    },
    content: {
      control: 'text',
    },
    isOpen: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    isToggleDisabled: {
      control: 'boolean',
    },
    isEditModeEnabled: {
      control: 'boolean',
    },
    isEditModeDisabled: {
      control: 'boolean',
    },
    titleTypography: {
      control: 'select',
      options: TYPOGRAPHY_OPTIONS,
    },
    contentTypography: {
      control: 'select',
      options: TYPOGRAPHY_OPTIONS,
    },
    titleColor: {
      control: 'select',
      options: TYPOGRAPHY_COLOR_OPTIONS,
    },
    contentColor: {
      control: 'select',
      options: TYPOGRAPHY_COLOR_OPTIONS,
    },
    paperType: {
      control: 'select',
      options: ACCORDION_PAPER_TYPE_OPTIONS,
    },
    isPaperColored: {
      control: 'boolean',
    },
    isRoundedCornersDisabled: {
      control: 'boolean',
    },
    children: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {
  render: args => {
    const [{ title, content, isOpen }, updateArgs] = useArgs()

    return (
      <Accordion
        {...args}
        isOpen={Boolean(isOpen)}
        title={String(title ?? '')}
        content={String(content ?? '')}
        onOpenChange={nextValue => updateArgs({ isOpen: nextValue })}
        onTitleChange={nextValue => updateArgs({ title: nextValue })}
        onContentChange={nextValue => updateArgs({ content: nextValue })}
      />
    )
  },
}

export const Open: StoryType = {
  args: {
    isOpen: true,
  },
}

export const Loading: StoryType = {
  args: {
    isOpen: true,
    isLoading: true,
  },
}

export const Editable: StoryType = {
  args: {
    isOpen: true,
    isEditModeEnabled: true,
    title: 'Editable accordion title',
    content: 'Editable accordion content',
  },
}

export const EditableDisabled: StoryType = {
  args: {
    isOpen: true,
    isEditModeEnabled: true,
    isEditModeDisabled: true,
    title: 'Editable disabled title',
    content: 'Forced disabled edit mode',
  },
}

export const WithCustomContent: StoryType = {
  args: {
    isOpen: true,
    title: 'Accordion with custom JSX',
  },
  render: args => (
    <Accordion {...args}>
      <div className="space-y-2">
        <Typography typography="BodySmall">
          You can pass custom content as children.
        </Typography>
        <Typography
          typography="CompactCaption"
          color="chart-1"
          className="normal-case">
          Chevron keeps smooth open/close animation.
        </Typography>
      </div>
    </Accordion>
  ),
}
