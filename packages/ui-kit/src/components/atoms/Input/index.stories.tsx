import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Calendar } from '@/components/atoms/Calendar'
import { Input } from '@/components/atoms/Input'
import { Paper } from '@/components/atoms/Paper'
import type { CalendarSelectionType } from '@/components/atoms/shared/calendar-picker'
import { TYPOGRAPHY_OPTIONS } from '@/components/atoms/Typography'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[520px]">
        <Story />
      </Paper>
    ),
  ],
  args: {
    label: 'Email',
    type: 'text',
    variant: 'outline',
    typography: 'Subheader',
    placeholder: 'Type here...',
    required: false,
    isRequired: false,
    mode: 'single',
    selectionScope: 'date',
    calendarComponent: Calendar,
    disabled: false,
    isError: false,
    errorText: 'error the field is required',
    isTextarea: false,
    textareaRowsCount: 4,
    isResizableX: false,
    isResizableY: false,
    isLoading: false,
  },
  argTypes: {
    label: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: ['text', 'number', 'email', 'password', 'checkbox', 'calendar'],
      if: { arg: 'isTextarea', truthy: false },
    },
    variant: {
      control: 'select',
      options: ['outline', 'text'],
      if: { arg: 'type', neq: 'calendar' },
    },
    typography: {
      control: 'select',
      options: TYPOGRAPHY_OPTIONS,
      if: { arg: 'type', neq: 'calendar' },
    },
    required: {
      control: 'boolean',
      if: { arg: 'type', neq: 'calendar' },
    },
    isRequired: {
      control: 'boolean',
      if: { arg: 'type', eq: 'calendar' },
    },
    mode: {
      control: 'select',
      options: ['single', 'range', 'ranged'],
      if: { arg: 'type', eq: 'calendar' },
    },
    selectionScope: {
      control: 'select',
      options: ['date', 'month', 'monthYear'],
      if: { arg: 'type', eq: 'calendar' },
    },
    isLoading: {
      control: 'boolean',
      if: { arg: 'type', eq: 'calendar' },
    },
    calendarComponent: {
      table: { disable: true },
      if: { arg: 'type', eq: 'calendar' },
    },
    disabled: {
      control: 'boolean',
    },
    isError: {
      control: 'boolean',
    },
    errorText: {
      control: 'text',
      if: { arg: 'isError', truthy: true },
    },
    isTextarea: {
      control: 'boolean',
      if: { arg: 'type', neq: 'calendar' },
    },
    textareaRowsCount: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      if: { arg: 'isTextarea', truthy: true },
    },
    isResizableX: {
      control: 'boolean',
      if: { arg: 'isTextarea', truthy: true },
    },
    isResizableY: {
      control: 'boolean',
      if: { arg: 'isTextarea', truthy: true },
    },
  },
  render: args => {
    if (args.type === 'calendar') {
      const [calendarValue, setCalendarValue] =
        useState<CalendarSelectionType>(undefined)

      return (
        <Input
          type="calendar"
          className={args.className}
          label={args.label}
          placeholder={args.placeholder}
          isRequired={args.isRequired}
          isError={args.isError}
          errorText={args.errorText}
          disabled={args.disabled}
          isLoading={args.isLoading}
          mode={args.mode ?? 'single'}
          selectionScope={args.selectionScope ?? 'date'}
          value={calendarValue}
          onChange={(nextValue: unknown) =>
            setCalendarValue(nextValue as CalendarSelectionType)
          }
          calendarComponent={args.calendarComponent ?? Calendar}
        />
      )
    }

    return (
      <Input
        className={args.className}
        label={args.label}
        type={args.type}
        variant={args.variant}
        typography={args.typography}
        placeholder={args.placeholder}
        required={args.required}
        disabled={args.disabled}
        isError={args.isError}
        errorText={args.errorText}
        isTextarea={args.isTextarea}
        textareaRowsCount={args.textareaRowsCount}
        isResizableX={args.isResizableX}
        isResizableY={args.isResizableY}
      />
    )
  },
} satisfies Meta<any>

export default meta

type Story = StoryObj<any>

export const Playground: Story = {
  args: {},
}
