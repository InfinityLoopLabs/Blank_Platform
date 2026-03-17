import * as React from 'react'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Typography,
  type TypographyColorType,
  type TypographyType,
} from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'
import { cn } from '@/lib/utils'

export type TableLightRowType = Record<
  string,
  string | number | null | undefined
>

export type TableLightColumnType = {
  key: string
  header: string
  typography?: TypographyType
  color?: TypographyColorType
  width?: number | string
  isEditable?: boolean
  placeholder?: string
  contentClassName?: string
  className?: string
}

export type TableLightPropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  columns: TableLightColumnType[]
  rows: TableLightRowType[]
  isEditModeEnabled?: boolean
  isEditModeDisabled?: boolean
  isInlineEditingLocked?: boolean
  onRowsChange?: (rows: TableLightRowType[]) => void
}

const toEditableString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

export const TableLight = ({
  columns,
  rows,
  className,
  isEditModeEnabled = false,
  isEditModeDisabled = false,
  isInlineEditingLocked = false,
  onRowsChange,
  ...property
}: TableLightPropertyType) => {
  const [localRows, setLocalRows] = React.useState(rows)
  const [editingCellId, setEditingCellId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (editingCellId) {
      return
    }
    setLocalRows(rows)
  }, [editingCellId, rows])

  const isInlineEditingEnabled =
    isEditModeEnabled && !isEditModeDisabled && !isInlineEditingLocked

  React.useEffect(() => {
    if (!isInlineEditingEnabled && editingCellId) {
      setEditingCellId(null)
    }
  }, [editingCellId, isInlineEditingEnabled])

  const updateCellValue = React.useCallback(
    (rowIndex: number, columnKey: string, nextValue: string) => {
      setLocalRows(previousRows => {
        const nextRows = previousRows.map((row, index) => {
          if (index !== rowIndex) {
            return row
          }

          return {
            ...row,
            [columnKey]: nextValue,
          }
        })

        onRowsChange?.(nextRows)

        return nextRows
      })
    },
    [onRowsChange],
  )

  const columnDefinitions = React.useMemo<ColumnDef<TableLightRowType>[]>(
    () =>
      columns.map(column => ({
        id: column.key,
        accessorFn: row => row[column.key],
        header: () => (
          <Typography
            typography="CompactCaption"
            color="muted-foreground"
            className="font-medium">
            {column.header}
          </Typography>
        ),
        cell: info => {
          const value = toEditableString(info.getValue())
          const cellId = `${info.row.id}:${column.key}`

          if (column.isEditable) {
            return (
              <EditableTypography
                value={value}
                onValueChange={nextValue => {
                  updateCellValue(info.row.index, column.key, nextValue)
                }}
                typography={column.typography ?? 'BodySmall'}
                color={column.color}
                placeholder={column.placeholder}
                contentClassName={column.contentClassName}
                className="!h-auto"
                isEditModeDisabled={!isInlineEditingEnabled}
                isEditModeOn={
                  isInlineEditingEnabled && editingCellId === cellId
                }
                onEditModeChange={nextValue => {
                  setEditingCellId(previousValue => {
                    if (nextValue) {
                      return cellId
                    }

                    return previousValue === cellId ? null : previousValue
                  })
                }}
              />
            )
          }

          return (
            <Typography
              typography={column.typography ?? 'BodySmall'}
              color={column.color ?? 'foreground'}
              className={column.contentClassName}>
              {value}
            </Typography>
          )
        },
      })),
    [columns, editingCellId, isInlineEditingEnabled, updateCellValue],
  )

  const table = useReactTable({
    data: localRows,
    columns: columnDefinitions,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className={cn('w-full overflow-x-auto', className)} {...property}>
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const column = columns.find(
                  item => item.key === header.column.id,
                )

                return (
                  <th
                    key={header.id}
                    className="border-b border-border px-3 py-2.5 align-middle"
                    style={
                      column?.width
                        ? {
                            width:
                              typeof column.width === 'number'
                                ? `${column.width}px`
                                : column.width,
                          }
                        : undefined
                    }>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => {
                const column = columns.find(item => item.key === cell.column.id)

                return (
                  <td
                    key={cell.id}
                    className={cn(
                      'border-b border-border px-3 py-2.5 align-top leading-[1.45]',
                      column?.className,
                    )}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
