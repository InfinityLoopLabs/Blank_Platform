import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusComparisonRow = {
  criteria: string
  infinityLoop: string
  traditional: string
}

export type CasaBrutusComparisonData = {
  title: string
  label: string
  rows: CasaBrutusComparisonRow[]
}

type CasaBrutusComparisonProps = {
  data: CasaBrutusComparisonData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusComparisonData) => void
}

export const CasaBrutusComparisonBlock: FC<CasaBrutusComparisonProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const updateRow = (
    rowIndex: number,
    field: keyof CasaBrutusComparisonRow,
    value: string,
  ) => {
    const nextRows = data.rows.map((row, idx) =>
      idx === rowIndex ? { ...row, [field]: value } : row,
    )
    onChange?.({ ...data, rows: nextRows })
  }

  const updateHeader = (field: keyof CasaBrutusComparisonData, value: string) => {
    onChange?.({ ...data, [field]: value })
  }

  return (
    <section
      style={{
        background: '#fff',
        padding: '80px 48px',
        fontFamily: FONT_SANS,
      }}>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
            Comparison
          </div>
          {isEditMode ? (
            <input
              type="text"
              value={data.title}
              onChange={event => updateHeader('title', event.target.value)}
              style={{
                fontSize: '24px',
                fontWeight: 300,
                margin: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
              }}
            />
          ) : (
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 300,
                margin: 0,
              }}>
              {data.title}
            </h2>
          )}
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #1a1a1a',
              }}>
              <th
                style={{
                  padding: '16px 0',
                  textAlign: 'left',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: '#999',
                  fontWeight: 'normal',
                  textTransform: 'uppercase',
                  width: '30%',
                }}>
                Criteria
              </th>
              <th
                style={{
                  padding: '16px 0',
                  textAlign: 'center',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: '#1a1a1a',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  width: '35%',
                }}>
                InfinityLoop
              </th>
              <th
                style={{
                  padding: '16px 0',
                  textAlign: 'center',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: '#999',
                  fontWeight: 'normal',
                  textTransform: 'uppercase',
                  width: '35%',
                }}>
                Traditional
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr
                key={`${row.criteria}-${rowIndex}`}
                style={{
                  borderBottom: '1px solid #eee',
                }}>
                {(['criteria', 'infinityLoop', 'traditional'] as const).map(
                  field => {
                    const cell = row[field]
                    const cellIndex =
                      field === 'criteria'
                        ? 0
                        : field === 'infinityLoop'
                          ? 1
                          : 2

                    return (
                      <td
                        key={`${rowIndex}-${field}`}
                        style={{
                          padding: '20px 0',
                          textAlign: cellIndex === 0 ? 'left' : 'center',
                          fontSize: cellIndex === 1 ? '14px' : '13px',
                          color:
                            cellIndex === 2
                              ? '#bbb'
                              : cellIndex === 1
                                ? '#1a1a1a'
                                : '#666',
                          fontWeight: cellIndex === 1 ? 500 : 'normal',
                        }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={cell}
                            onChange={event =>
                              updateRow(rowIndex, field, event.target.value)
                            }
                            style={{
                              width: '100%',
                              border: '1px solid #e0e0e0',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              outline: 'none',
                              background: '#fff',
                              textAlign: cellIndex === 0 ? 'left' : 'center',
                            }}
                          />
                        ) : (
                          cell
                        )}
                      </td>
                    )
                  },
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
