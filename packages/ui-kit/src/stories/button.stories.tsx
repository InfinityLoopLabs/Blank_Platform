import type { Meta, StoryObj } from "@storybook/react"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/atoms/Button"

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Infinityloop",
    state: "default",
    variant: "default",
    size: "default",
  },
  argTypes: {
    state: {
      control: "select",
      options: ["default", "active"],
    },
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Active: Story = {
  args: {
    state: "active",
    children: "Infinityloop",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
    state: "default",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
}

export const Link: Story = {
  args: {
    variant: "link",
    children: "Learn more",
  },
}

export const LogoSquare: Story = {
  args: {
    children: "∞",
    size: "icon",
    state: "active",
    className: "text-lg font-bold",
    "aria-label": "Infinity logo button",
  },
}

export const WithBothIcons: Story = {
  args: {
    children: "Infinityloop",
    leftIcon: <Sparkles className="size-4" />,
    rightIcon: <ArrowRight className="size-4" />,
  },
}
