import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/atoms/Calendar'

const meta = {
  title: 'Atoms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    isLoading: false,
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Включает loading-режим календаря.',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Calendar>

export default meta

type StoryType = StoryObj<typeof meta>

export const SingleDate: StoryType = {
  render: args => {
    const [selected, setSelected] = useState<Date | undefined>(new Date())
    const resolvedSelected = args.isLoading ? undefined : selected

    return (
      <div className="rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm">
        <Calendar
          {...args}
          mode="single"
          selected={resolvedSelected}
          onSelect={setSelected}
        />
      </div>
    )
  },
}

export const Range: StoryType = {
  render: args => {
    const [selected, setSelected] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    })
    const resolvedSelected = args.isLoading ? undefined : selected

    return (
      <div className="rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm">
        <Calendar
          {...args}
          mode="range"
          selected={resolvedSelected}
          onSelect={setSelected}
          numberOfMonths={2}
        />
      </div>
    )
  },
}
