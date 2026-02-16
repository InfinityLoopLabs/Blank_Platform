import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusCtaData = {
  label: string
  title: string
  description: string
  buttonText: string
}

type CasaBrutusCtaProps = {
  data: CasaBrutusCtaData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusCtaData) => void
}

export const CasaBrutusCtaBlock: FC<CasaBrutusCtaProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const updateField = (field: keyof CasaBrutusCtaData, value: string) => {
    onChange?.({ ...data, [field]: value })
  }

  return (
    <section
      style={{
        background: '#1a1a1a',
        padding: '80px 48px',
        textAlign: 'center',
        fontFamily: FONT_SANS,
      }}>
      {isEditMode ? (
        <input
          type="text"
          value={data.label}
          onChange={event => updateField('label', event.target.value)}
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: '24px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'center',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
          {data.label}
        </div>
      )}

      {isEditMode ? (
        <input
          type="text"
          value={data.title}
          onChange={event => updateField('title', event.target.value)}
          style={{
            fontSize: '32px',
            fontWeight: 300,
            color: '#fff',
            margin: '0 0 16px 0',
            letterSpacing: '0.1em',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'center',
          }}
        />
      ) : (
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 300,
            color: '#fff',
            margin: '0 0 16px 0',
            letterSpacing: '0.1em',
          }}>
          {data.title}
        </h2>
      )}

      {isEditMode ? (
        <input
          type="text"
          value={data.description}
          onChange={event => updateField('description', event.target.value)}
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '40px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'center',
          }}
        />
      ) : (
        <p
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '40px',
          }}>
          {data.description}
        </p>
      )}

      {isEditMode ? (
        <input
          type="text"
          value={data.buttonText}
          onChange={event => updateField('buttonText', event.target.value)}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            padding: '16px 48px',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textAlign: 'center',
            width: '100%',
            maxWidth: '240px',
            margin: '0 auto',
            display: 'block',
            outline: 'none',
          }}
        />
      ) : (
        <button
          type="button"
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            padding: '16px 48px',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}>
          {data.buttonText}
        </button>
      )}
    </section>
  )
}
