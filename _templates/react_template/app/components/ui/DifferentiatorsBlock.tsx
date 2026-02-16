import React, { type FC } from 'react'

type DifferentiatorColumnType = {
  title: string
  paragraphs: ReadonlyArray<string>
  highlightNote?: string
}

type DifferentiatorsBlockPropsType = {
  title: string
  columns: ReadonlyArray<DifferentiatorColumnType>
  accentColor?: string
}

const SERIF_FONT_FAMILY = "'Times New Roman','Georgia',serif"
const SANS_FONT_FAMILY = "'Arial','Helvetica',sans-serif"

export const DifferentiatorsBlock: FC<DifferentiatorsBlockPropsType> = ({
  title,
  columns,
  accentColor = 'var(--neon-main)',
}) => {
  const colors = {
    background: '#ffffff',
    border: '#dddddd',
    text: '#0a0a0a',
    textMuted: '#4a5568',
    accent: accentColor,
    noteBackground: '#f5f2eb',
  }

  return (
    <section
      style={{
        background: colors.background,
        borderTop: '3px solid #0a0a0a',
        borderBottom: `1px solid ${colors.border}`,
        fontFamily: SERIF_FONT_FAMILY,
      }}>
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '48px 40px',
        }}>
        <div
          style={{
            marginBottom: '32px',
            paddingBottom: '16px',
            borderBottom: `1px solid ${colors.border}`,
            fontFamily: SANS_FONT_FAMILY,
          }}>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: colors.text,
            }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                background: colors.accent,
                display: 'inline-block',
              }}
            />
            {title}
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '48px',
          }}>
          {columns.map((column, columnIndex) => (
            <div
              key={`differentiator-${columnIndex}`}
              style={{
                ...(columnIndex === 1
                  ? {
                      borderLeft: `1px solid ${colors.border}`,
                      borderRight: `1px solid ${colors.border}`,
                      paddingLeft: '48px',
                      paddingRight: '48px',
                    }
                  : {}),
              }}>
              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: '0 0 16px 0',
                  color: colors.text,
                }}>
                {column.title}
              </h4>

              {column.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={`${column.title}-${paragraphIndex}`}
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.8,
                    color: colors.textMuted,
                    textAlign: 'justify',
                    margin: paragraphIndex === column.paragraphs.length - 1 ? 0 : '0 0 16px 0',
                  }}>
                  {paragraph}
                </p>
              ))}

              {column.highlightNote ? (
                <div
                  style={{
                    background: colors.noteBackground,
                    padding: '16px',
                    borderLeft: `3px solid ${colors.accent}`,
                    fontStyle: 'italic',
                    fontSize: '0.875rem',
                    color: colors.textMuted,
                    marginTop: '16px',
                  }}>
                  {column.highlightNote}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
