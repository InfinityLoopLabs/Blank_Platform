import React, { type FC } from 'react'

const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export type CasaBrutusFooterData = {
  logo: string
  logoBold: string
  links: string[]
  copyright: string
}

type CasaBrutusFooterProps = {
  data: CasaBrutusFooterData
  isEditMode?: boolean
  onChange?: (next: CasaBrutusFooterData) => void
}

export const CasaBrutusFooterBlock: FC<CasaBrutusFooterProps> = ({
  data,
  isEditMode,
  onChange,
}) => {
  const updateField = (field: keyof CasaBrutusFooterData, value: string | string[]) => {
    onChange?.({ ...data, [field]: value } as CasaBrutusFooterData)
  }

  const updateLink = (index: number, value: string) => {
    const nextLinks = data.links.map((link, linkIndex) =>
      linkIndex === index ? value : link,
    )
    updateField('links', nextLinks)
  }

  return (
    <footer
      style={{
        background: '#fff',
        padding: '40px 48px',
        borderTop: '1px solid #e0e0e0',
        fontFamily: FONT_SANS,
      }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {isEditMode ? (
          <input
            type="text"
            value={data.logo}
            onChange={event => updateField('logo', event.target.value)}
            style={{
              fontSize: '14px',
              letterSpacing: '0.2em',
              fontWeight: 300,
              border: 'none',
              outline: 'none',
              background: 'transparent',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '0.2em',
              fontWeight: 300,
            }}>
            {data.logo}
            <span style={{ fontWeight: 600 }}>{data.logoBold}</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '32px',
          }}>
          {data.links.map((link, index) =>
            isEditMode ? (
              <input
                key={`${link}-${index}`}
                type="text"
                value={link}
                onChange={event => updateLink(index, event.target.value)}
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: '#999',
                  textTransform: 'uppercase',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                }}
              />
            ) : (
              <a
                key={`${link}-${index}`}
                href="#"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: '#999',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}>
                {link}
              </a>
            ),
          )}
        </div>

        {isEditMode ? (
          <input
            type="text"
            value={data.copyright}
            onChange={event => updateField('copyright', event.target.value)}
            style={{
              fontSize: '10px',
              color: '#ccc',
              letterSpacing: '0.1em',
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
              color: '#ccc',
              letterSpacing: '0.1em',
            }}>
            {data.copyright}
          </div>
        )}
      </div>
    </footer>
  )
}
