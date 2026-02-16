import React, { useState, type FC } from 'react'

const FONT_SERIF = "'Times New Roman','Georgia',serif"
const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusPrinciple = {
  num: string
  jp: string
  en: string
  desc: string
}

export type CasaBrutusPrinciplesData = {
  title: string
  counter: string
  items: CasaBrutusPrinciple[]
}

type CasaBrutusPrinciplesProps = {
  data: CasaBrutusPrinciplesData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusPrinciplesData) => void
}

export const CasaBrutusPrinciplesBlock: FC<CasaBrutusPrinciplesProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const updateItem = (index: number, field: keyof CasaBrutusPrinciple, value: string) => {
    const nextItems = data.items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    )
    onChange?.({ ...data, items: nextItems })
  }

  const updateHeader = (field: keyof CasaBrutusPrinciplesData, value: string) => {
    onChange?.({ ...data, [field]: value })
  }

  return (
    <section
      style={{
        background: '#f5f5f5',
        padding: '80px 48px',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        fontFamily: FONT_SANS,
      }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            paddingBottom: '24px',
            borderBottom: '1px solid #ddd',
          }}>
          <div>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
              Principles
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
                  letterSpacing: '0.1em',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                }}
              />
            ) : (
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 300,
                  margin: 0,
                  letterSpacing: '0.1em',
                }}>
                {data.title}
              </h2>
            )}
          </div>
          {isEditMode ? (
            <input
              type="text"
              value={data.counter}
              onChange={event => updateHeader('counter', event.target.value)}
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: '#999',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                textAlign: 'right',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: '#999',
              }}>
              {data.counter}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1px',
            background: '#ddd',
          }}>
          {data.items.map((item, index) => (
            <div
              key={item.num}
              onMouseEnter={() => setActiveIndex(index)}
              style={{
                background: activeIndex === index ? '#1a1a1a' : '#fff',
                padding: '40px 24px',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
              }}>
              {isEditMode ? (
                <input
                  type="text"
                  value={item.num}
                  onChange={event => updateItem(index, 'num', event.target.value)}
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: activeIndex === index ? '#666' : '#ccc',
                    marginBottom: '24px',
                    transition: 'color 0.4s',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: activeIndex === index ? '#666' : '#ccc',
                    marginBottom: '24px',
                    transition: 'color 0.4s',
                  }}>
                  {item.num}
                </div>
              )}

              {isEditMode ? (
                <input
                  type="text"
                  value={item.jp}
                  onChange={event => updateItem(index, 'jp', event.target.value)}
                  style={{
                    fontSize: '32px',
                    fontWeight: 300,
                    color: activeIndex === index ? '#fff' : '#1a1a1a',
                    marginBottom: '8px',
                    transition: 'color 0.4s',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: FONT_SERIF,
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 300,
                    color: activeIndex === index ? '#fff' : '#1a1a1a',
                    marginBottom: '8px',
                    transition: 'color 0.4s',
                    fontFamily: FONT_SERIF,
                  }}>
                  {item.jp}
                </div>
              )}

              {isEditMode ? (
                <input
                  type="text"
                  value={item.en}
                  onChange={event => updateItem(index, 'en', event.target.value)}
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: activeIndex === index ? '#888' : '#999',
                    textTransform: 'uppercase',
                    marginBottom: '24px',
                    transition: 'color 0.4s',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: activeIndex === index ? '#888' : '#999',
                    textTransform: 'uppercase',
                    marginBottom: '24px',
                    transition: 'color 0.4s',
                  }}>
                  {item.en}
                </div>
              )}

              <div
                style={{
                  width: '20px',
                  height: '1px',
                  background: activeIndex === index ? '#fff' : '#ddd',
                  marginBottom: '24px',
                  transition: 'background 0.4s',
                }}
              />

              {isEditMode ? (
                <textarea
                  value={item.desc}
                  onChange={event => updateItem(index, 'desc', event.target.value)}
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: activeIndex === index ? '#999' : '#888',
                    margin: 0,
                    marginTop: 'auto',
                    transition: 'color 0.4s',
                    width: '100%',
                    minHeight: '80px',
                    border: '1px solid #e0e0e0',
                    padding: '10px',
                    borderRadius: '6px',
                    outline: 'none',
                    background: '#fff',
                  }}
                />
              ) : (
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: activeIndex === index ? '#999' : '#888',
                    margin: 0,
                    marginTop: 'auto',
                    transition: 'color 0.4s',
                  }}>
                  {item.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
