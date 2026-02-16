import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusQuoteData = {
  text: string
  author: string
}

type CasaBrutusQuoteProps = {
  data: CasaBrutusQuoteData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusQuoteData) => void
}

export const CasaBrutusQuoteBlock: FC<CasaBrutusQuoteProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const updateField = (field: keyof CasaBrutusQuoteData, value: string) => {
    onChange?.({ ...data, [field]: value })
  }

  return (
    <section
      style={{
        background: '#f5f5f5',
        padding: '120px 48px',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        fontFamily: FONT_SANS,
      }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: '#ccc',
            margin: '0 auto 40px',
          }}
        />
        <blockquote style={{ margin: 0 }}>
          {isEditMode ? (
            <textarea
              value={data.text}
              onChange={event => updateField('text', event.target.value)}
              style={{
                fontSize: '24px',
                fontWeight: 300,
                lineHeight: 1.8,
                color: '#1a1a1a',
                margin: '0 0 32px 0',
                width: '100%',
                minHeight: '120px',
                border: '1px solid #e0e0e0',
                padding: '12px',
                borderRadius: '6px',
                outline: 'none',
                textAlign: 'center',
              }}
            />
          ) : (
            <p
              style={{
                fontSize: '24px',
                fontWeight: 300,
                lineHeight: 1.8,
                color: '#1a1a1a',
                margin: '0 0 32px 0',
              }}>
              {data.text}
            </p>
          )}

          {isEditMode ? (
            <input
              type="text"
              value={data.author}
              onChange={event => updateField('author', event.target.value)}
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                textAlign: 'center',
              }}
            />
          ) : (
            <footer
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
              }}>
              {data.author}
            </footer>
          )}
        </blockquote>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: '#ccc',
            margin: '40px auto 0',
          }}
        />
      </div>
    </section>
  )
}
