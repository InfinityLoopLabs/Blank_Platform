import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Paper } from '@/components/atoms/Paper'
import {
  TableLight,
  type TableLightColumnType,
  type TableLightRowType,
} from '@/components/templates/TableLight'

const columns: TableLightColumnType[] = [
  {
    key: 'title',
    header: 'Название',
    width: 320,
    isEditable: true,
    typography: 'SectionHeader',
  },
  {
    key: 'category',
    header: 'Категория',
    width: 220,
    isEditable: true,
    typography: 'BodySmall',
    contentClassName: 'uppercase tracking-wide',
    color: 'muted-foreground',
  },
  {
    key: 'status',
    header: 'Статус',
    width: 160,
    isEditable: true,
    typography: 'Action',
  },
  {
    key: 'updatedAt',
    header: 'Обновлено',
    width: 180,
    typography: 'BodySmall',
    color: 'muted-foreground',
  },
]

const rows: TableLightRowType[] = [
  {
    title: 'React: от компонентов до production',
    category: 'Frontend Track',
    status: 'Draft',
    updatedAt: '18.03.2026',
  },
  {
    title: 'Go: высоконагруженные backend-сервисы',
    category: 'Backend Track',
    status: 'Published',
    updatedAt: '17.03.2026',
  },
  {
    title: 'Kubernetes: оркестрация в реальных проектах',
    category: 'DevOps Track',
    status: 'Review',
    updatedAt: '15.03.2026',
  },
]

type TableLightStoryPropertyType = {
  columns: TableLightColumnType[]
  rows: TableLightRowType[]
  isEditModeEnabled: boolean
  isEditModeDisabled: boolean
  isInlineEditingLocked: boolean
  onRowsChange: (rows: TableLightRowType[]) => void
}

const meta = {
  title: 'Templates/TableLight',
  component: TableLight,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-full p-4">
        <Paper type="dark" className="p-4">
          <Story />
        </Paper>
      </div>
    ),
  ],
  args: {
    columns,
    rows,
    isEditModeEnabled: true,
    isEditModeDisabled: false,
    isInlineEditingLocked: false,
    onRowsChange: fn(),
  },
  argTypes: {
    columns: {
      control: false,
    },
    rows: {
      control: false,
    },
    isEditModeEnabled: {
      control: 'boolean',
    },
    isEditModeDisabled: {
      control: 'boolean',
    },
    isInlineEditingLocked: {
      control: 'boolean',
    },
    onRowsChange: {
      table: { disable: true },
    },
  },
  render: ({ onRowsChange, ...property }: TableLightStoryPropertyType) => {
    const [localRows, setLocalRows] = React.useState<TableLightRowType[]>(
      property.rows,
    )

    return (
      <TableLight
        {...property}
        rows={localRows}
        onRowsChange={nextRows => {
          setLocalRows(nextRows)
          onRowsChange(nextRows)
        }}
      />
    )
  },
} satisfies Meta<TableLightStoryPropertyType>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
