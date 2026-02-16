import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'
import { v4 as uuidv4 } from 'uuid'
import type {
  TableBlockRequestDto,
  TableCellDto,
  TableColumnDto,
  TableRowDto,
} from '@generated/hooks/drafts'
import { EditableSpan } from './EditableSpan'

const TABLE_BLOCK_DEFAULT_CELL_VALUE = 'Value'

type TableBrickModeType = 'create' | 'update'

export type TableBrickPropertyType = {
  value: string
  isEditModeEnabled: boolean
  mode?: TableBrickModeType
  isSubmitting?: boolean
  actionLabel?: string
  onChange: Callback<string>
  onSubmit?: Callback<string>
}

type EditableTableStateType = TableBlockRequestDto & {
  columns: TableColumnDto[]
  rows: TableRowDto[]
}

const onGenerateId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

const onCreateEmptyTable = (): EditableTableStateType => ({
  title: 'Untitled table',
  notes: '',
  columns: [
    {
      id: onGenerateId('column'),
      title: 'Column 1',
      description: '',
    },
    {
      id: onGenerateId('column'),
      title: 'Column 2',
      description: '',
    },
  ],
  rows: [
    {
      id: uuidv4(),
      title: 'Row 1',
      description: 'Description',
      cells: [],
    },
  ],
})

const onParseTableValue = (value: string): EditableTableStateType => {
  if (!value) {
    return onCreateEmptyTable()
  }

  try {
    const parsed = JSON.parse(value) as TableBlockRequestDto

    return {
      ...onCreateEmptyTable(),
      ...parsed,
      columns: Array.isArray(parsed?.columns)
        ? parsed.columns.map(column => ({
            id:
              typeof column?.id === 'string' && column.id.length > 0
                ? column.id
                : onGenerateId('column'),
            title:
              typeof column?.title === 'string' && column.title.length > 0
                ? column.title
                : 'Column',
            description:
              typeof column?.description === 'string' ? column.description : '',
          }))
        : onCreateEmptyTable().columns,
      rows: Array.isArray(parsed?.rows)
        ? parsed.rows.map(row => ({
            title:
              typeof row?.title === 'string' && row.title.length > 0
                ? row.title
                : 'Row',
            description:
              typeof row?.description === 'string' ? row.description : '',
            cells: Array.isArray(row?.cells)
              ? row.cells.map(cell => ({
                  column_id:
                    typeof cell?.column_id === 'string' &&
                    cell.column_id.length > 0
                      ? cell.column_id
                      : '',
                  value:
                    typeof cell?.value === 'string' ||
                    typeof cell?.value === 'number'
                      ? String(cell?.value ?? '')
                      : '',
                }))
              : [],
          }))
        : onCreateEmptyTable().rows,
    }
  } catch {
    return onCreateEmptyTable()
  }
}

const onNormalizeColumns = (columns: TableColumnDto[]): TableColumnDto[] =>
  columns.map(column => {
    const normalizedId =
      typeof column?.id === 'string' && column.id.length > 0
        ? column.id
        : onGenerateId('column')

    return {
      ...column,
      id: normalizedId,
      title:
        typeof column?.title === 'string' && column.title.length > 0
          ? column.title
          : 'Column',
      description:
        typeof column?.description === 'string' ? column.description : '',
    }
  })

const onEnsureRowCells = (
  row: TableRowDto,
  columns: TableColumnDto[],
): TableRowDto => {
  const rowCells = Array.isArray(row?.cells) ? [...row.cells] : []

  const normalizedCells = columns.map(column => {
    const existingCell =
      rowCells.find(cell => cell.column_id === column.id) || null

    const resolveCellValue = (value: TableCellDto | null) => {
      if (
        value &&
        (typeof value.value === 'string' || typeof value.value === 'number')
      ) {
        const resolvedValue = String(value.value ?? '').trim()

        return resolvedValue.length > 0
          ? resolvedValue
          : TABLE_BLOCK_DEFAULT_CELL_VALUE
      }

      return TABLE_BLOCK_DEFAULT_CELL_VALUE
    }

    if (existingCell) {
      return {
        column_id: column.id,
        value: resolveCellValue(existingCell),
      }
    }

    return {
      column_id: column.id,
      value: TABLE_BLOCK_DEFAULT_CELL_VALUE,
    }
  })

  return {
    ...row,
    id: typeof row?.id === 'string' && row.id.length > 0 ? row.id : uuidv4(),
    cells: normalizedCells,
  }
}

const onNormalizeTableState = (
  value: EditableTableStateType,
): EditableTableStateType => {
  const normalizedColumns = onNormalizeColumns(value.columns || [])
  const normalizedRows = (value.rows || []).map(row =>
    onEnsureRowCells(row, normalizedColumns),
  )

  return {
    ...value,
    columns: normalizedColumns,
    rows: normalizedRows,
  }
}

const onFillEmptyTableValues = (
  value: EditableTableStateType,
): EditableTableStateType => {
  const columns = value.columns || []
  const filledRows = (value.rows || []).map((row, rowIndex) => {
    const normalizedTitle =
      typeof row.title === 'string' && row.title.trim().length > 0
        ? row.title
        : `Row ${rowIndex + 1}`
    const normalizedCells = (row.cells || []).map((cell, cellIndex) => {
      const fallbackColumnId =
        columns[cellIndex]?.id || columns[0]?.id || onGenerateId('column')
      const normalizedColumnId =
        typeof cell.column_id === 'string' && cell.column_id.length > 0
          ? cell.column_id
          : fallbackColumnId
      const normalizedValue =
        typeof cell.value === 'string' && cell.value.trim().length > 0
          ? cell.value
          : TABLE_BLOCK_DEFAULT_CELL_VALUE

      return {
        ...cell,
        column_id: normalizedColumnId,
        value: normalizedValue,
      }
    })

    return {
      ...row,
      title: normalizedTitle,
      cells: normalizedCells,
    }
  })

  return {
    ...value,
    rows: filledRows,
  }
}

const onStringifyTable = (value: EditableTableStateType) =>
  JSON.stringify(value, null, 2)

export const TableBrick: FC<TableBrickPropertyType> = ({
  value,
  isEditModeEnabled,
  mode = 'update',
  isSubmitting = false,
  actionLabel,
  onChange,
  onSubmit,
}) => {
  const latestSerializedValueRef = useRef(value)
  const tableStateRef = useRef<EditableTableStateType | null>(null)
  const [tableState, setTableState] = useState<EditableTableStateType>(() => {
    const initialState = onFillEmptyTableValues(
      onNormalizeTableState(onParseTableValue(value)),
    )
    tableStateRef.current = initialState
    latestSerializedValueRef.current = onStringifyTable(initialState)

    return initialState
  })
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null)
  const [sortedRowId, setSortedRowId] = useState<string | null>(null)
  const isInternalUpdateRef = useRef(false)
  const hasPendingChangesRef = useRef(false)
  const hasQueuedSubmitAttemptRef = useRef(false)
  const onSubmitPendingChanges = () => {
    if (
      !isEditModeEnabled ||
      !onSubmit ||
      !hasPendingChangesRef.current ||
      isSubmitting
    ) {
      if (isSubmitting && hasPendingChangesRef.current) {
        hasQueuedSubmitAttemptRef.current = true
      }

      return
    }

    hasQueuedSubmitAttemptRef.current = false
    hasPendingChangesRef.current = false
    onSubmit(latestSerializedValueRef.current)
  }

  useEffect(() => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false

      return
    }

    const nextState = onFillEmptyTableValues(
      onNormalizeTableState(onParseTableValue(value)),
    )
    tableStateRef.current = nextState
    setTableState(nextState)
    latestSerializedValueRef.current = onStringifyTable(nextState)
    hasPendingChangesRef.current = false
    setEditingFieldId(null)
  }, [value])

  useEffect(() => {
    if (!isEditModeEnabled) {
      setEditingFieldId(null)
      setSelectedCellId(null)
      hasPendingChangesRef.current = false
      hasQueuedSubmitAttemptRef.current = false
    }
  }, [isEditModeEnabled])
  useEffect(() => {
    if (!isSubmitting && hasQueuedSubmitAttemptRef.current) {
      onSubmitPendingChanges()
    }
  }, [isSubmitting])

  useEffect(() => {
    if (!sortedRowId) {
      return
    }

    const hasRow = tableState.rows.some(
      (row, index) => String(row.id || `row-${index}`) === sortedRowId,
    )

    if (!hasRow) {
      setSortedRowId(null)
    }
  }, [sortedRowId, tableState.rows])

  const onEnableFieldEdit = (fieldId: string) => {
    if (!isEditModeEnabled) {
      return
    }

    setEditingFieldId(fieldId)
  }

  const onFinishFieldEdit = () => {
    setEditingFieldId(null)
    onSubmitPendingChanges()
  }

  const onSelectCell = (cellId: string) => {
    if (isEditModeEnabled) {
      return
    }

    setSelectedCellId(prevCellId => (prevCellId === cellId ? null : cellId))
  }

  const onToggleRowSort = (rowId: string) => {
    setSortedRowId(prevRowId => (prevRowId === rowId ? null : rowId))
  }

  const sortedColumnOrder = useMemo(() => {
    const columnIndexes = tableState.columns.map((_, index) => index)

    if (!sortedRowId) {
      return columnIndexes
    }

    const targetRowEntry = tableState.rows
      .map((row, index) => ({
        row,
        id: String(row.id || `row-${index}`),
      }))
      .find(candidate => candidate.id === sortedRowId)

    if (!targetRowEntry) {
      return columnIndexes
    }

    const getCellValue = (columnId: string) => {
      const cell =
        targetRowEntry.row.cells?.find(
          candidate => candidate.column_id === columnId,
        ) || null
      const value = cell?.value ?? ''
      const numeric = Number(value)

      return Number.isNaN(numeric) ? String(value) : numeric
    }

    return [...columnIndexes].sort((indexA, indexB) => {
      const columnA = tableState.columns[indexA]
      const columnB = tableState.columns[indexB]
      const valueA = getCellValue(columnA?.id || '')
      const valueB = getCellValue(columnB?.id || '')

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueB - valueA
      }

      return String(valueB).localeCompare(String(valueA))
    })
  }, [tableState.columns, tableState.rows, sortedRowId])

  const onUpdateTableState = (
    updater: Callback<EditableTableStateType, EditableTableStateType>,
  ) => {
    hasPendingChangesRef.current = true
    const currentState = tableStateRef.current || tableState
    const nextState = updater(currentState)
    const payload = onFillEmptyTableValues(onNormalizeTableState(nextState))
    const serializedValue = onStringifyTable(payload)

    tableStateRef.current = payload
    isInternalUpdateRef.current = true
    latestSerializedValueRef.current = serializedValue
    onChange(serializedValue)
    setTableState(payload)
  }

  const onUpdateColumnField = (
    columnIndex: number,
    field: keyof TableColumnDto,
    fieldValue: string,
  ) => {
    onUpdateTableState(prevState => {
      const columns = [...prevState.columns]
      const targetColumn = { ...(columns[columnIndex] || {}) }
      const sanitizedValue = fieldValue

      if (field === 'id') {
        const previousId = targetColumn.id
        targetColumn.id = sanitizedValue

        const rows = prevState.rows.map(row => ({
          ...row,
          cells: row.cells?.map(cell =>
            cell.column_id === previousId
              ? { ...cell, column_id: sanitizedValue }
              : cell,
          ) as TableCellDto[],
        }))

        columns[columnIndex] = targetColumn

        return {
          ...prevState,
          columns,
          rows,
        }
      }

      ;(targetColumn as Record<string, string>)[field] = sanitizedValue
      columns[columnIndex] = targetColumn

      return {
        ...prevState,
        columns,
      }
    })
  }

  const onRemoveColumn = (columnIndex: number) => {
    onUpdateTableState(prevState => {
      if (prevState.columns.length <= 1) {
        return prevState
      }

      const removedColumn = prevState.columns[columnIndex]
      const columns = prevState.columns.filter(
        (_, index) => index !== columnIndex,
      )
      const rows = prevState.rows.map(row => ({
        ...row,
        cells: row.cells?.filter(
          cell => cell.column_id !== removedColumn.id,
        ) as TableCellDto[],
      }))

      return {
        ...prevState,
        columns,
        rows,
      }
    })
    onSubmitPendingChanges()
  }

  const onAddColumn = () => {
    onUpdateTableState(prevState => {
      const nextColumn: TableColumnDto = {
        id: onGenerateId('column'),
        title: `Column ${prevState.columns.length + 1}`,
        description: '',
      }

      return {
        ...prevState,
        columns: [...prevState.columns, nextColumn],
      }
    })
    // Save will be triggered after the user edits new cells to avoid sending empty payloads.
  }

  const onAddRow = () => {
    onUpdateTableState(prevState => {
      const nextRow: TableRowDto = {
        id: uuidv4(),
        title: `Row ${prevState.rows.length + 1}`,
        description: '',
        cells: prevState.columns.map(column => ({
          column_id: column.id || onGenerateId('column'),
          value: TABLE_BLOCK_DEFAULT_CELL_VALUE,
        })),
      }

      return {
        ...prevState,
        rows: [...prevState.rows, nextRow],
      }
    })
    // Save will be triggered after the user edits new cells to avoid sending empty payloads.
  }

  const onRemoveRow = (rowIndex: number) => {
    onUpdateTableState(prevState => {
      if (prevState.rows.length <= 1) {
        return prevState
      }

      return {
        ...prevState,
        rows: prevState.rows.filter((_, index) => index !== rowIndex),
      }
    })
    onSubmitPendingChanges()
  }

  const onUpdateRowField = (
    rowIndex: number,
    field: keyof TableRowDto,
    fieldValue: string,
  ) => {
    onUpdateTableState(prevState => {
      const rows = [...prevState.rows]
      const targetRow = { ...(rows[rowIndex] || {}) }
      ;(targetRow as Record<string, string>)[field] = fieldValue
      rows[rowIndex] = targetRow

      return {
        ...prevState,
        rows,
      }
    })
  }

  const onUpdateCellField = (
    rowIndex: number,
    columnId: string,
    fieldValue: string,
  ) => {
    onUpdateTableState(prevState => {
      const rows = [...prevState.rows]
      const targetRow = { ...(rows[rowIndex] || {}) }
      const cells = Array.isArray(targetRow.cells) ? [...targetRow.cells] : []
      const targetCellIndex = cells.findIndex(
        cell => cell.column_id === columnId,
      )

      if (targetCellIndex === -1) {
        cells.push({
          column_id: columnId,
          value: fieldValue,
        } as TableCellDto)
      } else {
        const cell = { ...(cells[targetCellIndex] || {}) }
        ;(cell as Record<string, string>).value = fieldValue
        cells[targetCellIndex] = cell
      }

      targetRow.cells = cells
      rows[rowIndex] = targetRow

      return {
        ...prevState,
        rows,
      }
    })
  }

  const resolvedActionLabel =
    actionLabel ||
    (mode === 'create' ? 'Create table block' : 'Save table block')

  const renderTable = () => {
    const totalColumns =
      tableState.columns.length + 1 + (isEditModeEnabled ? 1 : 0)
    const orderedColumns = sortedColumnOrder.map(columnIndex => ({
      column: tableState.columns[columnIndex],
      columnIndex,
    }))

    return (
      <div className="bg-(--shani-ember-dim)/15 border border-(--shani-ember-dim) rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--shani-ember-dim)/40">
                <th className="p-4 text-left text-(--shani-ember-soft) text-xs font-mono uppercase">
                  КРИТЕРИЙ
                </th>
                {orderedColumns.map(({ column, columnIndex }) => {
                  const columnFieldId = `column-${column?.id || columnIndex}`

                  return (
                    <th
                      key={columnFieldId}
                      className="p-4 text-center border-l border-(--shani-ember-dim)/40">
                      <EditableSpan
                        value={column?.title || ''}
                        isEditing={
                          isEditModeEnabled && editingFieldId === columnFieldId
                        }
                        autoFocus={editingFieldId === columnFieldId}
                        placeholder={`Column ${columnIndex + 1}`}
                        inputClassName="text-center px-2 py-1"
                        displayClassName="text-(--neon-main) font-mono text-sm text-center"
                        isButton={isEditModeEnabled}
                        onEnableEditModeHandler={
                          isEditModeEnabled
                            ? () => onEnableFieldEdit(columnFieldId)
                            : undefined
                        }
                        onSubmitHandler={onFinishFieldEdit}
                        onChangeHandler={value =>
                          onUpdateColumnField(columnIndex, 'title', value)
                        }
                      />
                      <EditableSpan
                        value={column?.description || ''}
                        isEditing={
                          isEditModeEnabled &&
                          editingFieldId === `${columnFieldId}-description`
                        }
                        autoFocus={
                          editingFieldId === `${columnFieldId}-description`
                        }
                        placeholder="Description"
                        inputClassName="mt-2 text-center px-2 py-1 text-xs"
                        displayClassName="text-(--neon-main)/40 text-xs mt-1 text-center min-h-[1rem]"
                        shouldDisplayPlaceholder={false}
                        isButton={isEditModeEnabled}
                        onEnableEditModeHandler={
                          isEditModeEnabled
                            ? () =>
                                onEnableFieldEdit(
                                  `${columnFieldId}-description`,
                                )
                            : undefined
                        }
                        onSubmitHandler={onFinishFieldEdit}
                        onChangeHandler={value =>
                          onUpdateColumnField(columnIndex, 'description', value)
                        }
                      />
                      {isEditModeEnabled && (
                        <button
                          type="button"
                          className={clsx(
                            'mt-2 text-[10px] uppercase tracking-widest text-(--neon-main) transition hover:text-(--neon-main-bright)',
                            tableState.columns.length <= 1 &&
                              'pointer-events-none opacity-30',
                          )}
                          onClick={() => onRemoveColumn(columnIndex)}
                          disabled={tableState.columns.length <= 1}>
                          Удалить
                        </button>
                      )}
                    </th>
                  )
                })}
                {isEditModeEnabled && (
                  <th className="w-32 p-4 text-center border-l border-(--shani-ember-dim)/40">
                    <button
                      type="button"
                      className="rounded-(--radius) border border-(--neon-main)/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--shani-ember-soft) transition hover:bg-(--neon-main)/10"
                      onClick={onAddColumn}>
                      + Column
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableState.rows.map((row, rowIndex) => {
                const rowIdentifier = String(row.id || `row-${rowIndex}`)
                const rowFieldId = `row-${rowIdentifier}`

                return (
                  <tr
                    key={rowFieldId}
                    className={clsx(
                      'border-b border-(--shani-ember-dim)/40 hover:bg-(--shani-ember)/5 transition-colors',
                      rowIndex % 2 === 0 ? 'bg-black/30' : '',
                    )}>
                    <td className="p-4 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <EditableSpan
                            value={row.title || ''}
                            isEditing={
                              isEditModeEnabled && editingFieldId === rowFieldId
                            }
                            autoFocus={editingFieldId === rowFieldId}
                            placeholder={`Row ${rowIndex + 1}`}
                            inputClassName="px-2 py-1"
                            displayClassName="text-white text-sm"
                            isButton={isEditModeEnabled}
                            onEnableEditModeHandler={
                              isEditModeEnabled
                                ? () => onEnableFieldEdit(rowFieldId)
                                : undefined
                            }
                            onSubmitHandler={onFinishFieldEdit}
                            onChangeHandler={value =>
                              onUpdateRowField(rowIndex, 'title', value)
                            }
                          />
                          <EditableSpan
                        value={row.description || ''}
                        isEditing={
                          isEditModeEnabled &&
                          editingFieldId === `${rowFieldId}-description`
                        }
                            autoFocus={
                              editingFieldId === `${rowFieldId}-description`
                            }
                        placeholder="Description"
                        inputClassName="mt-2 px-2 py-1 text-xs"
                        displayClassName="text-(--neon-main)/40 text-xs mt-1 min-h-[1rem]"
                        shouldDisplayPlaceholder={false}
                        isButton={isEditModeEnabled}
                            onEnableEditModeHandler={
                              isEditModeEnabled
                                ? () =>
                                    onEnableFieldEdit(
                                      `${rowFieldId}-description`,
                                    )
                                : undefined
                            }
                            onSubmitHandler={onFinishFieldEdit}
                            onChangeHandler={value =>
                              onUpdateRowField(rowIndex, 'description', value)
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={clsx(
                              'text-xs transition',
                              sortedRowId === rowIdentifier
                                ? 'text-(--neon-main)'
                                : 'text-(--neon-main)/30 hover:text-(--neon-main)/60',
                            )}
                            onClick={() => onToggleRowSort(rowIdentifier)}>
                            ↕
                          </button>
                          {isEditModeEnabled && (
                            <button
                              type="button"
                              className={clsx(
                                'text-[10px] uppercase tracking-widest text-(--neon-main) transition hover:text-(--neon-main-bright)',
                                tableState.rows.length <= 1 &&
                                  'pointer-events-none opacity-30',
                              )}
                              onClick={() => onRemoveRow(rowIndex)}
                              disabled={tableState.rows.length <= 1}>
                              Удалить
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    {orderedColumns.map(({ column, columnIndex }) => {
                      const cell =
                        row.cells?.find(
                          candidate => candidate.column_id === column?.id,
                        ) || row.cells?.[columnIndex]
                      const resolvedColumnId = column?.id || ''
                      const cellFieldId = `cell-${rowIdentifier}-${resolvedColumnId || columnIndex}`

                      return (
                        <td
                          key={cellFieldId}
                          className={clsx(
                            'p-4 text-center border-l border-(--shani-ember-dim)/40 transition-all',
                            !isEditModeEnabled &&
                              'cursor-pointer hover:bg-(--shani-ember)/5',
                            !isEditModeEnabled &&
                              selectedCellId === cellFieldId &&
                              'bg-(--neon-main)/10 ring-1 ring-(--neon-main) ring-inset',
                          )}
                          onClick={() => onSelectCell(cellFieldId)}>
                          <EditableSpan
                            value={cell?.value || ''}
                            isEditing={
                              isEditModeEnabled &&
                              editingFieldId === cellFieldId
                            }
                            autoFocus={editingFieldId === cellFieldId}
                            placeholder="Value"
                            inputClassName="px-2 py-1 text-center"
                            displayClassName="text-white text-center"
                            isButton={isEditModeEnabled}
                            onEnableEditModeHandler={
                              isEditModeEnabled
                                ? () => onEnableFieldEdit(cellFieldId)
                                : undefined
                            }
                            onSubmitHandler={onFinishFieldEdit}
                            onChangeHandler={value =>
                              onUpdateCellField(
                                rowIndex,
                                resolvedColumnId,
                                value,
                              )
                            }
                          />
                        </td>
                      )
                    })}
                    {isEditModeEnabled && (
                      <td className="p-4 border-l border-(--shani-ember-dim)/40" />
                    )}
                  </tr>
                )
              })}
            </tbody>
            {isEditModeEnabled && (
              <tfoot>
                <tr>
                  <td
                    className="border-t border-(--shani-ember-dim)/30 p-4 text-left"
                    colSpan={totalColumns}>
                    <button
                      type="button"
                      className="rounded-(--radius) border border-(--neon-main)/40 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-(--shani-ember-soft) transition hover:bg-(--neon-main)/10"
                      onClick={onAddRow}>
                      + Row
                    </button>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    )
  }

  return (
    <Flex column className="w-full gap-4">
      {renderTable()}

      {isEditModeEnabled && onSubmit && isSubmitting && (
        <div className="flex justify-end">
          <span className="text-xs text-(--muted-foreground)">
            {resolvedActionLabel}
          </span>
        </div>
      )}
    </Flex>
  )
}
