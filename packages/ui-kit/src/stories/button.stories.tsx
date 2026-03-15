import type { Meta, StoryObj } from "@storybook/react"

import { BUTTON_COLOR_OPTIONS, BUTTON_VARIANT_OPTIONS, Button } from "@/components/atoms/Button"

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
    variant: "filled",
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
    variant: {
      control: "select",
      options: BUTTON_VARIANT_OPTIONS,
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
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Filled</p>
          {buttonColorRows.map((row, rowIndex) => (
            <div className="flex flex-wrap gap-3" key={`filled-${rowIndex}`}>
              {row.map(color => (
                <Button {...args} variant="filled" color={color} key={`filled-${color}`}>
                  {color}
                </Button>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Outline</p>
          {buttonColorRows.map((row, rowIndex) => (
            <div className="flex flex-wrap gap-3" key={`outline-${rowIndex}`}>
              {row.map(color => (
                <Button {...args} variant="outline" color={color} key={`outline-${color}`}>
                  {color}
                </Button>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Text</p>
          {buttonColorRows.map((row, rowIndex) => (
            <div className="flex flex-wrap gap-3" key={`text-${rowIndex}`}>
              {row.map(color => (
                <Button {...args} variant="text" color={color} key={`text-${color}`}>
                  {color}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
