import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Dropdown } from '@/components/atoms/Dropdown'
import { Paper } from '@/components/atoms/Paper'

const meta = {
  title: 'Atoms/Dropdown/Calendar',
  component: Dropdown,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[760px] p-6">
        <Story />
      </Paper>
    ),
  ],
  args: {
    isLoading: false,
    disabled: false,
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<any>

export default meta

type StoryType = StoryObj<any>

export const Single: StoryType = {
  render: args => {
    const [value, setValue] = useState<Date | undefined>(undefined)

    return (
      <Dropdown
        {...args}
        type="calendar"
        label="Date"
        placeholder="Select date"
        mode="single"
        value={value}
        onChange={nextValue => setValue(nextValue as Date | undefined)}
      />
    )
  },
}
