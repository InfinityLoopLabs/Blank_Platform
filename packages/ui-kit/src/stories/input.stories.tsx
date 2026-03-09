import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "@/components/ui/input"

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: "Type here...",
    disabled: false,
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Disabled input",
  },
}
