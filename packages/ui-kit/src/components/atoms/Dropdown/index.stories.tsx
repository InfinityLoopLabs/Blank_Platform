import type { Meta, StoryObj } from '@storybook/react'

import { Dropdown } from '@/components/atoms/Dropdown'
import { Paper } from '@/components/atoms/Paper'

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
    options: demoOptions,
    label: 'Direction',
    placeholder: 'Select direction',
    required: false,
    isError: false,
    errorText: 'error the field is required',
    isSearchable: false,
  },
  argTypes: {
    options: {
      table: { disable: true },
    },
    onValueChange: {
      table: { disable: true },
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
    },
    searchPlaceholder: {
      control: 'text',
      if: { arg: 'isSearchable', truthy: true },
    },
  },
} satisfies Meta<typeof Dropdown>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {},
}

export const Searchable: Story = {
  args: {
    isSearchable: true,
  },
}
