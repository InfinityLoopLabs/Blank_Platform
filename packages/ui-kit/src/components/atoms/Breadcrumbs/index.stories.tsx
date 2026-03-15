import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import {
  Breadcrumbs,
  type BreadcrumbsItemType,
} from '@/components/atoms/Breadcrumbs'
import { Paper } from '@/components/atoms/Paper'

type StoryLinkPropertyType = {
  to: string
  children: ReactNode
}

const StoryLink = ({ to, children }: StoryLinkPropertyType) => (
  <a href={to}>{children}</a>
)

const baseItems: BreadcrumbsItemType[] = [
  {
    label: 'Home',
    href: '#',
  },
  {
    label: 'Catalog',
    href: '#',
  },
  {
    label: 'Sneakers',
    href: '#',
  },
  {
    label: 'Air Max 90',
  },
]

const customComponentItems: BreadcrumbsItemType[] = [
  <StoryLink key="home" to="/">
    Home
  </StoryLink>,
  {
    component: <StoryLink to="/catalog">Catalog</StoryLink>,
  },
  {
    component: <StoryLink to="/catalog/sneakers">Sneakers</StoryLink>,
  },
  {
    label: 'Air Max 90',
  },
]

const longItems: BreadcrumbsItemType[] = [
  {
    label: 'Home',
    href: '#',
  },
  {
    label: 'Categories',
    href: '#',
  },
  {
    label: 'Shoes',
    href: '#',
  },
  {
    label: 'Running',
    href: '#',
  },
  {
    label: 'Nike',
    href: '#',
  },
  {
    label: 'Air Max 90',
  },
]

const meta = {
  title: 'Atoms/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[520px] p-6">
        <Story />
      </Paper>
    ),
  ],
  args: {
    items: baseItems,
  },
  argTypes: {
    items: {
      table: { disable: true },
    },
    maxItems: {
      control: {
        type: 'number',
        min: 2,
        max: 10,
        step: 1,
      },
    },
    separator: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}

export const Collapsed: StoryType = {
  args: {
    items: longItems,
    maxItems: 3,
  },
}

export const CustomSeparator: StoryType = {
  args: {
    separator: '/',
  },
}

export const CustomComponents: StoryType = {
  args: {
    items: customComponentItems,
  },
}
