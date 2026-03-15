import type { Meta, StoryObj } from "@storybook/react"
import { ArrowRight, Sparkles } from "lucide-react"

import { BUTTON_COLOR_OPTIONS, Button } from "@/components/atoms/Button"

const buttonColorRows = [
  ["primary", "secondary", "accent", "muted"],
  ["constructive", "cautionary", "destructive"],
  ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
] as const

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    animation: "default",
    size: "default",
    color: "chart-1",
  },
  argTypes: {
    animation: {
      control: "select",
      options: ["default", "active"],
    },
    color: {
      control: "select",
      options: BUTTON_COLOR_OPTIONS,
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const AllColors: Story = {
  render: args => (
    <div className="w-full max-w-5xl rounded-xl border border-(--border) bg-(--card) p-4">
      <div className="flex flex-col gap-3">
        {buttonColorRows.map((row, rowIndex) => (
          <div className="flex flex-wrap gap-3" key={rowIndex}>
            {row.map(color => (
              <Button
                {...args}
                color={color}
                key={color}
                leftIcon={<Sparkles className="size-4" />}
                rightIcon={<ArrowRight className="size-4" />}>
                {color}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
}
