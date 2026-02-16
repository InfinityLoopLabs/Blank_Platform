import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusIntroData = {
  lead: string
  paragraph: string
  signatureLabel: string
  signatureLine: string
}

type CasaBrutusIntroProps = {
  data: CasaBrutusIntroData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusIntroData) => void
}

export const CasaBrutusIntro: FC<CasaBrutusIntroProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const handleField = (field: keyof CasaBrutusIntroData, value: string) => {
    onChange?.({ ...data, [field]: value })
  }

  return (
    <section
      style={{
        background: '#fff',
        padding: '80px 48px',
        fontFamily: FONT_SANS,
        color: '#1a1a1a',
      }}>
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
        }}>
        {isEditMode ? (
          <textarea
            value={data.lead}
            onChange={event => handleField('lead', event.target.value)}
            style={{
              fontSize: '16px',
              lineHeight: 2.2,
              color: '#333',
              textAlign: 'justify',
              width: '100%',
              minHeight: '120px',
              border: '1px solid #e0e0e0',
              padding: '12px',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        ) : (
          <p
            style={{
              fontSize: '16px',
              lineHeight: 2.2,
              color: '#333',
              textAlign: 'justify',
            }}>
            <span
              style={{
                float: 'left',
                fontSize: '64px',
                lineHeight: 1,
                marginRight: '12px',
                marginTop: '6px',
                fontWeight: 300,
              }}>
              {data.lead.charAt(0)}
            </span>
            {data.lead.slice(1)}
          </p>
        )}

        {isEditMode ? (
          <textarea
            value={data.paragraph}
            onChange={event => handleField('paragraph', event.target.value)}
            style={{
              fontSize: '15px',
              lineHeight: 2.2,
              color: '#666',
              marginTop: '32px',
              textAlign: 'justify',
              width: '100%',
              minHeight: '100px',
              border: '1px solid #e0e0e0',
              padding: '12px',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        ) : (
          <p
            style={{
              fontSize: '15px',
              lineHeight: 2.2,
              color: '#666',
              marginTop: '32px',
              textAlign: 'justify',
            }}>
            {data.paragraph}
          </p>
        )}

        <div
          style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {isEditMode ? (
            <input
              type="text"
              value={data.signatureLabel}
              onChange={event => handleField('signatureLabel', event.target.value)}
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
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#999',
                textTransform: 'uppercase',
              }}>
              {data.signatureLabel}
            </span>
          )}

          {isEditMode ? (
            <input
              type="text"
              value={data.signatureLine}
              onChange={event => handleField('signatureLine', event.target.value)}
              style={{
                fontSize: '10px',
                color: '#ccc',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                textAlign: 'right',
              }}
            />
          ) : (
            <span
              style={{
                fontSize: '10px',
                color: '#ccc',
              }}>
              {data.signatureLine}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
