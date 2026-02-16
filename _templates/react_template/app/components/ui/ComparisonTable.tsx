import { useMemo, useState } from 'react'
import type { FC } from 'react'

type ComparisonTableBadgeValueType = {
  type: 'good' | 'bad' | 'neutral'
  text: string
}

type ComparisonTableItemValueType =
  | string
  | number
  | boolean
  | ComparisonTableBadgeValueType

type ComparisonTableItemType = {
  id: string
  name: string
  subtitle?: Nullable<string>
  values: Record<string, ComparisonTableItemValueType>
}

type ComparisonTableCriterionType = {
  key: string
  label: string
  description?: Nullable<string>
  type: 'number' | 'boolean' | 'rating' | 'badge' | string
  higherIsBetter?: boolean
}

type ComparisonTablePropertyType = {
  title?: string
  items?: ReadonlyArray<ComparisonTableItemType>
  criteria?: ReadonlyArray<ComparisonTableCriterionType>
  highlightBest?: boolean
  sortBy?: Nullable<string>
  defaultSortBy?: Nullable<string>
  onSortByChange?: Callback<Nullable<string>>
  selectedCell?: Nullable<string>
  defaultSelectedCell?: Nullable<string>
  onSelectedCellChange?: Callback<Nullable<string>>
}

const badgeColorDictionary: Record<
  ComparisonTableBadgeValueType['type'],
  string
> = {
  good: 'bg-green-500/20 text-green-400 border-green-500/30',
  bad: 'bg-red-500/20 text-red-400 border-red-500/30',
  neutral: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

export const ComparisonTable: FC<ComparisonTablePropertyType> = ({
  title,
  items = [],
  criteria = [],
  highlightBest = true,
  sortBy,
  defaultSortBy = null,
  onSortByChange,
  selectedCell,
  defaultSelectedCell = null,
  onSelectedCellChange,
}) => {
  const isSortControlled = sortBy !== undefined
  const [internalSortBy, setInternalSortBy] =
    useState<Nullable<string>>(defaultSortBy)
  const resolvedSortBy = (isSortControlled ? sortBy : internalSortBy) ?? null

  const isSelectedCellControlled = selectedCell !== undefined
  const [internalSelectedCell, setInternalSelectedCell] =
    useState<Nullable<string>>(defaultSelectedCell)
  const resolvedSelectedCell =
    (isSelectedCellControlled ? selectedCell : internalSelectedCell) ?? null

  const sortedItems = useMemo(() => {
    if (!resolvedSortBy) {
      return items
    }

    return [...items].sort((current, next) => {
      const currentValue = current.values[resolvedSortBy]
      const nextValue = next.values[resolvedSortBy]

      if (typeof currentValue === 'number' && typeof nextValue === 'number') {
        return nextValue - currentValue
      }

      return String(nextValue ?? '').localeCompare(String(currentValue ?? ''))
    })
  }, [items, resolvedSortBy])

  const handleSortChange = (criterionKey: Nullable<string>): void => {
    if (!isSortControlled) {
      setInternalSortBy(criterionKey)
    }

    if (onSortByChange) {
      onSortByChange(criterionKey)
    }
  }

  const handleCellSelect = (cellId: Nullable<string>): void => {
    if (!isSelectedCellControlled) {
      setInternalSelectedCell(cellId)
    }

    if (onSelectedCellChange) {
      onSelectedCellChange(cellId)
    }
  }

  const getBestItemId = (criterionKey: string): Nullable<string> => {
    if (!highlightBest) {
      return null
    }

    const criterion = criteria.find(({ key }) => key === criterionKey)
    if (!criterion) {
      return null
    }

    let bestValue = criterion.higherIsBetter ? -Infinity : Infinity
    let bestItemId: Nullable<string> = null

    items.forEach(item => {
      const value = item.values[criterionKey]
      if (typeof value !== 'number') {
        return
      }

      const shouldUpdate = criterion.higherIsBetter
        ? value > bestValue
        : value < bestValue

      if (shouldUpdate) {
        bestValue = value
        bestItemId = item.id
      }
    })

    return bestItemId
  }

  const renderValue = (
    value: ComparisonTableItemValueType,
    type: ComparisonTableCriterionType['type'],
  ): JSX.Element => {
    if (type === 'boolean') {
      return value ? (
        <span className="text-green-500">✓</span>
      ) : (
        <span className="text-red-500/50">✗</span>
      )
    }

    if (type === 'rating') {
      const ratingValue = typeof value === 'number' ? value : 0

      return (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(index => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index <= ratingValue ? 'bg-orange-500' : 'bg-neutral-700'}`}
            />
          ))}
        </div>
      )
    }

    if (type === 'badge') {
      const badgeValue =
        typeof value === 'object' && value !== null
          ? (value as ComparisonTableBadgeValueType)
          : { type: 'neutral',
text: String(value ?? '') }

      return (
        <span
          className={`px-2 py-0.5 text-xs font-mono border rounded ${
            badgeColorDictionary[badgeValue.type]
          }`}>
          {badgeValue.text}
        </span>
      )
    }

    return <span className="text-white">{String(value ?? '')}</span>
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-orange-500/20">
              <th className="p-4 text-left text-orange-500/60 text-xs font-mono">
                КРИТЕРИЙ
              </th>
              {sortedItems.map(item => (
                <th
                  key={item.id}
                  className="p-4 text-center border-l border-orange-500/10">
                  <div className="text-orange-500 font-mono text-sm">
                    {item.name}
                  </div>
                  {item.subtitle && (
                    <div className="text-orange-500/40 text-xs mt-1">
                      {item.subtitle}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, rowIndex) => {
              const bestItemId = getBestItemId(criterion.key)

              return (
                <tr
                  key={criterion.key}
                  className={`border-b border-orange-500/10 hover:bg-orange-500/5 transition-colors ${
                    rowIndex % 2 === 0 ? 'bg-black/30' : ''
                  }`}>
                  <td className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">
                          {criterion.label}
                        </div>
                        {criterion.description && (
                          <div className="text-orange-500/40 text-xs mt-1">
                            {criterion.description}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          handleSortChange(
                            resolvedSortBy === criterion.key
                              ? null
                              : criterion.key,
                          )
                        }
                        className={`ml-2 text-xs ${
                          resolvedSortBy === criterion.key
                            ? 'text-orange-500'
                            : 'text-orange-500/30 hover:text-orange-500/60'
                        }`}>
                        ↕
                      </button>
                    </div>
                  </td>
                  {sortedItems.map(item => {
                    const value = item.values[criterion.key]
                    const cellId = `${item.id}-${criterion.key}`
                    const isBest = bestItemId === item.id
                    const isSelected = resolvedSelectedCell === cellId

                    return (
                      <td
                        key={item.id}
                        onClick={() =>
                          handleCellSelect(isSelected ? null : cellId)
                        }
                        className={`
                          p-4 text-center border-l border-orange-500/10 cursor-pointer transition-all
                          ${isBest ? 'bg-orange-500/10' : ''}
                          ${isSelected ? 'ring-1 ring-orange-500 ring-inset' : ''}
                        `}>
                        <div className="flex items-center justify-center gap-2">
                          {renderValue(value, criterion.type)}
                          {isBest && (
                            <span className="text-orange-500 text-xs">★</span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
