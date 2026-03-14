import type { Meta, StoryObj } from "@storybook/react"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    isGlow: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
    isGlow: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
}

export const Glow: Story = {
  args: {
    children: "Glow Button",
    isGlow: true,
    variant: "default",
  },
}

export const LogoSquare: Story = {
  args: {
    children: "∞",
    size: "icon",
    isGlow: true,
    className: "text-lg font-bold",
    "aria-label": "Infinity logo button",
  },
}

export const WithLeftIcon: Story = {
  args: {
    children: "Left Icon",
    leftIcon: <Sparkles className="size-4" />,
  },
}

export const WithRightIcon: Story = {
  args: {
    children: "Right Icon",
    rightIcon: <ArrowRight className="size-4" />,
  },
}

export const WithBothIcons: Story = {
  args: {
    children: "Continue",
    leftIcon: <Sparkles className="size-4" />,
    rightIcon: <ArrowRight className="size-4" />,
  },
}
