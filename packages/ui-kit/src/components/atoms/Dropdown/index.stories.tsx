import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Calendar } from '@/components/atoms/Calendar'
import { Dropdown } from '@/components/atoms/Dropdown'
import { Paper } from '@/components/atoms/Paper'
import type { CalendarSelectionType } from '@/components/atoms/shared/calendar-picker'

const demoOptions = [
  { value: 'distributed-systems', label: 'Distributed Systems' },
  { value: 'databases', label: 'Databases' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'networking', label: 'Networking' },
  { value: 'systems-thinking', label: 'Systems Thinking' },
]

const meta = {
  title: 'Atoms/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[520px] p-6">
        <Story />
      </Paper>
    ),
  ],
  args: {
    type: 'default',
    mode: 'single',
    selectionScope: 'date',
    calendarComponent: Calendar,
    options: demoOptions,
    label: 'Direction',
    placeholder: 'Select direction',
    required: false,
    isError: false,
    errorText: 'error the field is required',
    isSearchable: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'calendar'],
    },
    calendarComponent: {
      table: { disable: true },
      if: { arg: 'type', eq: 'calendar' },
    },
    options: {
      table: { disable: true },
      if: { arg: 'type', eq: 'default' },
    },
    onValueChange: {
      table: { disable: true },
      if: { arg: 'type', eq: 'default' },
    },
    value: {
      table: { disable: true },
    },
    defaultValue: {
      table: { disable: true },
    },
    label: {
      control: 'text',
    },
    required: {
      control: 'boolean',
      if: { arg: 'type', eq: 'default' },
    },
    isRequired: {
      control: 'boolean',
      if: { arg: 'type', eq: 'calendar' },
    },
    isError: {
      control: 'boolean',
    },
    errorText: {
      control: 'text',
      if: { arg: 'isError', truthy: true },
    },
    isSearchable: {
      control: 'boolean',
      if: { arg: 'type', eq: 'default' },
    },
    searchPlaceholder: {
      control: 'text',
      if: { arg: 'type', eq: 'default' },
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
  },
  render: args => {
    if (args.type === 'calendar') {
      const [calendarValue, setCalendarValue] =
        useState<CalendarSelectionType>(undefined)

      return (
        <Dropdown
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
          onChange={nextValue =>
            setCalendarValue(nextValue as CalendarSelectionType)
          }
          calendarComponent={args.calendarComponent ?? Calendar}
        />
      )
    }

    return (
      <Dropdown
        type="default"
        className={args.className}
        options={demoOptions}
        label={args.label}
        placeholder={args.placeholder}
        required={args.required}
        isError={args.isError}
        errorText={args.errorText}
        isSearchable={args.isSearchable}
        searchPlaceholder={args.searchPlaceholder}
        disabled={args.disabled}
      />
    )
  },
} satisfies Meta<any>

export default meta

type Story = StoryObj<any>

export const Playground: Story = {
  args: {},
}
