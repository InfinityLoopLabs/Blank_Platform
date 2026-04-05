import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkillInventoryCvBuilder } from '@/showcase/SkillInventoryCvBuilder'

const meta = {
  title: 'Showcase/Skill Inventory CV Builder',
  component: SkillInventoryCvBuilder,
  parameters: {
    layout: 'fullscreen',
  },
  render: args => <SkillInventoryCvBuilder {...args} />,
  args: {
    roleTitle: 'Backend / senior',
    userId: '#user-0142',
  },
  argTypes: {
    roleTitle: {
      control: 'text',
    },
    userId: {
      control: 'text',
    },
  },
} satisfies Meta<typeof SkillInventoryCvBuilder>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
