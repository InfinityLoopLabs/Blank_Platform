import type { Meta, StoryObj } from '@storybook/react'

import { Timer } from '@/components/atoms/Timer'

const DAY_IN_MS = 24 * 60 * 60 * 1000
const HOUR_IN_MS = 60 * 60 * 1000
const MINUTE_IN_MS = 60 * 1000
const SECOND_IN_MS = 1000

const createTargetDate = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
) =>
  new Date(
    Date.now() +
      days * DAY_IN_MS +
      hours * HOUR_IN_MS +
      minutes * MINUTE_IN_MS +
      seconds * SECOND_IN_MS,
  )

const meta = {
  title: 'Atoms/Timer',
  component: Timer,
  tags: ['autodocs'],
  render: args => (
    <div className="inline-flex rounded-(--radius) border border-(--border) bg-(--background) p-4">
      <Timer {...args} />
    </div>
  ),
  args: {
    targetDate: createTargetDate(2, 22, 36, 14),
  },
  argTypes: {
    targetDate: {
      control: 'date',
      description: 'Дата/время окончания таймера.',
    },
    labels: {
      control: 'object',
      description: 'Кастомные подписи для дней, часов, минут и секунд.',
    },
  },
} satisfies Meta<typeof Timer>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
