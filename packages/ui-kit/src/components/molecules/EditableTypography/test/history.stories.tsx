import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import type { TypographyType } from '@/components/atoms/Typography'
import { TYPOGRAPHY_OPTIONS } from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'

const meta = {
  title: 'Molecules/EditableTypography/Test/History',
  component: EditableTypography,
  parameters: {
    docs: {
      disable: true,
    },
  },
  decorators: [
    Story => (
      <Paper type="dark" className="w-[560px] p-8">
        <Story />
      </Paper>
    ),
  ],
  args: {
    typography: 'Subheader',
    defaultValue: 'History sample',
    placeholder: 'Type value...',
    isEditModeDisabled: false,
    isLoading: false,
  },
  argTypes: {
    typography: {
      control: 'select',
      options: TYPOGRAPHY_OPTIONS,
    },
    defaultValue: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    isLoading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof EditableTypography>

export default meta

type StoryType = StoryObj<typeof meta>

const renderStory = (args: StoryType['args']) => (
  <div
    data-testid="editable-typography-history"
    className="w-[420px] border border-(--border) rounded-lg p-4">
    <EditableTypography {...args} />
  </div>
)

const createTypographyStory = (typography: TypographyType): StoryType => ({
  args: {
    typography,
    defaultValue: `${typography} sample`,
  },
  render: args => renderStory(args),
})

export const Heading: StoryType = createTypographyStory('Heading')
export const SectionHeader: StoryType = createTypographyStory('SectionHeader')
export const CompactHeader: StoryType = createTypographyStory('CompactHeader')
export const Action: StoryType = createTypographyStory('Action')
export const Subheader: StoryType = createTypographyStory('Subheader')
export const Body: StoryType = createTypographyStory('Body')
export const BodySmall: StoryType = createTypographyStory('BodySmall')
export const Caption: StoryType = createTypographyStory('Caption')
export const CompactCaption: StoryType = createTypographyStory('CompactCaption')

export const Playground: StoryType = {
  args: {
    typography: 'Subheader',
    defaultValue: 'History sample',
  },
  render: args => (
    renderStory(args)
  ),
}
