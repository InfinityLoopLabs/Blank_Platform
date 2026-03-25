import type { Meta, StoryObj } from '@storybook/react-vite'

import { SolidLongread } from '@/showcase/SolidLongread'

const meta = {
  title: 'Showcase/SOLID Article',
  component: SolidLongread,
  parameters: {
    layout: 'fullscreen',
  },
  render: args => <SolidLongread {...args} />,
  args: {
    isLoading: false,
    isEditModeOn: false,
    isEditModeDisabled: false,
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
    isEditModeOn: {
      control: 'boolean',
    },
    isEditModeDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SolidLongread>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
