import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "@/components/atoms/Input"
import { Paper } from "@/components/atoms/Paper"

const meta: Meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[520px]">
        <Story />
      </Paper>
    ),
  ],
  args: {
    label: "",
    placeholder: "Type here...",
    required: false,
    disabled: false,
    isError: false,
    errorText: "error the field is required",
    isTextarea: false,
    textareaRowsCount: 4,
    isResizableX: false,
    isResizableY: false,
  },
  argTypes: {
    label: {
      control: "text",
    },
    required: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    isError: {
      control: "boolean",
    },
    errorText: {
      control: "text",
      if: { arg: "isError", truthy: true },
    },
    isTextarea: {
      control: "boolean",
    },
    textareaRowsCount: {
      control: { type: "number", min: 1, max: 20, step: 1 },
      if: { arg: "isTextarea", truthy: true },
    },
    isResizableX: {
      control: "boolean",
      if: { arg: "isTextarea", truthy: true },
    },
    isResizableY: {
      control: "boolean",
      if: { arg: "isTextarea", truthy: true },
    },
  },
}

export default meta
type Story = StoryObj

export const Playground: Story = {}
