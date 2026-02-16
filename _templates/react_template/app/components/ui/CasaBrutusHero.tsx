import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusHeroData = {
  category: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  description: string
  caption: string
}

type CasaBrutusHeroProps = {
  data: CasaBrutusHeroData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusHeroData) => void
}

export const CasaBrutusHero: FC<CasaBrutusHeroProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const handleField = (field: keyof CasaBrutusHeroData, next: string) => {
    onChange?.({ ...data, [field]: next })
  }

  return (
    <section
      style={{
        background: '#fff',
        padding: '80px 48px',
        borderBottom: '1px solid #e0e0e0',
        fontFamily: FONT_SANS,
        color: '#1a1a1a',
      }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr',
          gap: '60px',
          alignItems: 'center',
        }}>
        <div>
          {isEditMode ? (
            <input
              type="text"
              value={data.category}
              onChange={event => handleField('category', event.target.value)}
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
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
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
              {data.category}
            </div>
          )}

          <h1
            style={{
              fontSize: '48px',
              fontWeight: 300,
              lineHeight: 1.3,
              margin: '0 0 24px 0',
              letterSpacing: '0.05em',
            }}>
            {isEditMode ? (
              <textarea
                value={`${data.titleLine1}\n${data.titleLine2}`}
                onChange={event => {
                  const [line1, line2 = ''] = event.target.value.split('\n')
                  handleField('titleLine1', line1)
                  handleField('titleLine2', line2)
                }}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '48px',
                  fontWeight: 300,
                  lineHeight: 1.3,
                  letterSpacing: '0.05em',
                  resize: 'none',
                }}
              />
            ) : (
              <>
                {data.titleLine1}
                <br />
                <span style={{ fontWeight: 600 }}>{data.titleLine2}</span>
              </>
            )}
          </h1>

          {isEditMode ? (
            <input
              type="text"
              value={data.subtitle}
              onChange={event => handleField('subtitle', event.target.value)}
              style={{
                fontSize: '14px',
                color: '#666',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '0 0 32px 0',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
              }}
            />
          ) : (
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '0 0 32px 0',
              }}>
              {data.subtitle}
            </p>
          )}

          <div
            style={{
              width: '40px',
              height: '1px',
              background: '#1a1a1a',
              marginBottom: '32px',
            }}
          />

          {isEditMode ? (
            <textarea
              value={data.description}
              onChange={event => handleField('description', event.target.value)}
              style={{
                fontSize: '14px',
                lineHeight: 2,
                color: '#666',
                maxWidth: '360px',
                width: '100%',
                border: '1px solid #e0e0e0',
                padding: '12px',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          ) : (
            <p
              style={{
                fontSize: '14px',
                lineHeight: 2,
                color: '#666',
                maxWidth: '360px',
              }}>
              {data.description}
            </p>
          )}
        </div>

        <div
          style={{
            width: '1px',
            height: '300px',
            background: '#e0e0e0',
          }}
        />

        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '100%',
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
            <div
              style={{
                width: '200px',
                height: '200px',
                border: '1px solid #ccc',
                borderRadius: '50%',
                position: 'absolute',
              }}
            />
            <div
              style={{
                width: '140px',
                height: '140px',
                border: '1px solid #999',
                transform: 'rotate(45deg)',
                position: 'absolute',
              }}
            />
            <div
              style={{
                width: '8px',
                height: '8px',
                background: '#1a1a1a',
                borderRadius: '50%',
              }}
            />
          </div>
          {isEditMode ? (
            <input
              type="text"
              value={data.caption}
              onChange={event => handleField('caption', event.target.value)}
              style={{
                marginTop: '16px',
                fontSize: '10px',
                color: '#999',
                letterSpacing: '0.1em',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
              }}
            />
          ) : (
            <div
              style={{
                marginTop: '16px',
                fontSize: '10px',
                color: '#999',
                letterSpacing: '0.1em',
              }}>
              {data.caption}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
