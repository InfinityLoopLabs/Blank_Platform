import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusHeaderData = {
  issue: string
  taglineTop: string
  logo: string
  logoBoldPart: string
  taglineBottom: string
  price: string
}

type CasaBrutusHeaderProps = {
  data: CasaBrutusHeaderData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusHeaderData) => void
}

export const CasaBrutusHeader: FC<CasaBrutusHeaderProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const handleField = (field: keyof CasaBrutusHeaderData, next: string) => {
    onChange?.({ ...data, [field]: next })
  }

  return (
    <header
      style={{
        padding: '24px 48px',
        borderBottom: '1px solid #e0e0e0',
        background: '#fff',
        fontFamily: FONT_SANS,
        color: '#1a1a1a',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
        {isEditMode ? (
          <input
            type="text"
            value={data.issue}
            onChange={event => handleField('issue', event.target.value)}
            style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#999',
              textTransform: 'uppercase',
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
              color: '#999',
              textTransform: 'uppercase',
            }}>
            {data.issue}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          {isEditMode ? (
            <input
              type="text"
              value={data.taglineTop}
              onChange={event => handleField('taglineTop', event.target.value)}
              style={{
                fontSize: '11px',
                letterSpacing: '0.4em',
                color: '#999',
                marginBottom: '4px',
                textTransform: 'uppercase',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                textAlign: 'center',
                width: '100%',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.4em',
                color: '#999',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}>
              {data.taglineTop}
            </div>
          )}

          {isEditMode ? (
            <input
              type="text"
              value={data.logo}
              onChange={event => handleField('logo', event.target.value)}
              style={{
                fontSize: '28px',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                textAlign: 'center',
                width: '100%',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '28px',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}>
              {data.logo}
              <span style={{ fontWeight: 600 }}>{data.logoBoldPart}</span>
            </div>
          )}

          {isEditMode ? (
            <input
              type="text"
              value={data.taglineBottom}
              onChange={event => handleField('taglineBottom', event.target.value)}
              style={{
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: '#666',
                marginTop: '4px',
                textTransform: 'uppercase',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                textAlign: 'center',
                width: '100%',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: '#666',
                marginTop: '4px',
                textTransform: 'uppercase',
              }}>
              {data.taglineBottom}
            </div>
          )}
        </div>

        {isEditMode ? (
          <input
            type="text"
            value={data.price}
            onChange={event => handleField('price', event.target.value)}
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
            {data.price}
          </div>
        )}
      </div>
    </header>
  )
}
