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
    placeholder: "Type here...",
    required: false,
    disabled: false,
    isTextarea: false,
    isResizableX: false,
    isResizableY: false,
    textareaRows: 4,
  },
  argTypes: {
    isTextarea: {
      control: "boolean",
    },
    isResizableX: {
      control: "boolean",
    },
    isResizableY: {
      control: "boolean",
    },
    textareaRows: {
      control: { type: "number", min: 1, max: 20, step: 1 },
    },
  },
}

export default meta
type Story = StoryObj

export const Playground: Story = {}
