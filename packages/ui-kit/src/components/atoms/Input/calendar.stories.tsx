import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { DateRange } from 'react-day-picker'

import { Input } from '@/components/atoms/Input'
import { Paper } from '@/components/atoms/Paper'

const meta = {
  title: 'Atoms/Input/Calendar',
  component: Input,
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
      <Input
        {...args}
        type="calendar"
        label="Date"
        placeholder="Select date"
        mode="single"
        value={value}
        onChange={(nextValue: unknown) => setValue(nextValue as Date | undefined)}
      />
    )
  },
}

export const Range: StoryType = {
  render: args => {
    const [value, setValue] = useState<DateRange | undefined>(undefined)

    return (
      <Input
        {...args}
        type="calendar"
        label="Date range"
        placeholder="Select range"
        mode="range"
        value={value}
        onChange={(nextValue: unknown) => setValue(nextValue as DateRange | undefined)}
      />
    )
  },
}
