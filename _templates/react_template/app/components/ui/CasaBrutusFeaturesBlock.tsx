import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusFeatureCard = {
  num: string
  title: string
  en: string
  desc: string
}

export type CasaBrutusFeaturesData = {
  title: string
  label: string
  cards: CasaBrutusFeatureCard[]
}

type CasaBrutusFeaturesProps = {
  data: CasaBrutusFeaturesData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusFeaturesData) => void
}

export const CasaBrutusFeaturesBlock: FC<CasaBrutusFeaturesProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const updateCard = (index: number, field: keyof CasaBrutusFeatureCard, value: string) => {
    const nextCards = data.cards.map((card, cardIndex) =>
      cardIndex === index ? { ...card, [field]: value } : card,
    )
    onChange?.({ ...data, cards: nextCards })
  }

  const updateHeader = (field: keyof CasaBrutusFeaturesData, value: string) => {
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
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
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
              Features
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
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
          {data.cards.map((card, index) => (
            <div
              key={card.num}
              style={{
                border: '1px solid #e0e0e0',
                padding: '32px',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
              {isEditMode ? (
                <input
                  type="text"
                  value={card.num}
                  onChange={event => updateCard(index, 'num', event.target.value)}
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: '#ccc',
                    marginBottom: '24px',
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
                    color: '#ccc',
                    marginBottom: '24px',
                  }}>
                  {card.num}
                </div>
              )}

              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#f5f5f5',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                  }}
                />
              </div>

              {isEditMode ? (
                <input
                  type="text"
                  value={card.title}
                  onChange={event => updateCard(index, 'title', event.target.value)}
                  style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    margin: '0 0 8px 0',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                  }}
                />
              ) : (
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    margin: '0 0 8px 0',
                  }}>
                  {card.title}
                </h3>
              )}

              {isEditMode ? (
                <input
                  type="text"
                  value={card.en}
                  onChange={event => updateCard(index, 'en', event.target.value)}
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: '#999',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: '#999',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                  }}>
                  {card.en}
                </div>
              )}

              {isEditMode ? (
                <textarea
                  value={card.desc}
                  onChange={event => updateCard(index, 'desc', event.target.value)}
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: '#888',
                    margin: 0,
                    width: '100%',
                    minHeight: '80px',
                    border: '1px solid #e0e0e0',
                    padding: '10px',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              ) : (
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: '#888',
                    margin: 0,
                  }}>
                  {card.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
