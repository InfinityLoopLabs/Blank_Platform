import React, { Fragment, type CSSProperties, type FC } from 'react'
import { clsx } from '@infinityloop.labs/utils'
import { Minus, Plus } from 'lucide-react'
import { IconCircleButton } from './IconCircleButton'
import {
  LEARNING_PRINCIPLES_SECTION_SUBTITLE_DEFAULT,
  LEARNING_PRINCIPLES_SECTION_TITLE_DEFAULT,
} from '@constants/learning-principles'

export type LearningPrincipleItemType = {
  numeral: string
  title: string
  description: string
}

export type LearningPrinciplesQuoteType = {
  text: string
  highlight?: string
  author: string
}

export type LearningPrincipleFieldChangePayloadType = {
  index: number
  field: keyof LearningPrincipleItemType
  value: string
}

export type LearningPrinciplesQuoteFieldChangePayloadType = {
  field: keyof LearningPrinciplesQuoteType
  value: string
}

export type LearningPrinciplesMetadataFieldChangePayloadType = {
  field: 'title' | 'subtitle'
  value: string
}

type ColorThemeType = {
  background: string
  accent: string
  textPrimary: string
  textMuted: string
  divider: string
  quoteMuted: string
}

type OwnPropertyType = {
  className?: string
  items: ReadonlyArray<LearningPrincipleItemType>
  quote: LearningPrinciplesQuoteType
  theme?: Partial<ColorThemeType>
  sectionTitle?: string
  sectionSubtitle?: string
  isEditMode?: boolean
  isDisabled?: boolean
  addPrincipleLabel?: string
  onAddPrincipleHandler?: VoidFunction
  onRemovePrincipleHandler?: Callback<number>
  onPrincipleFieldChangeHandler?: Callback<LearningPrincipleFieldChangePayloadType>
  onQuoteFieldChangeHandler?: Callback<LearningPrinciplesQuoteFieldChangePayloadType>
  onMetadataFieldChangeHandler?: Callback<LearningPrinciplesMetadataFieldChangePayloadType>
  onSaveHandler?: VoidFunction
  actionLabel?: string
  isSubmitting?: boolean
}

const DEFAULT_THEME: ColorThemeType = {
  background: '#f5f2eb',
  accent: 'var(--neon-main)',
  textPrimary: '#1f2937',
  textMuted: '#4b5563',
  divider: '#e5e7eb',
  quoteMuted: '#9ca3af',
}

const SERIF_FONT_FAMILY = "'Times New Roman','Georgia',serif"
const ACCENT_LABEL_FONT_FAMILY = "'Arial','sans-serif'"

const buildThemeStyle = (
  theme: ColorThemeType,
): CSSProperties & Record<string, string> => ({
  '--learning-principles-background': theme.background,
  '--learning-principles-accent': theme.accent,
  '--learning-principles-text': theme.textPrimary,
  '--learning-principles-muted': theme.textMuted,
  '--learning-principles-divider': theme.divider,
  '--learning-principles-quote-muted': theme.quoteMuted,
})

const renderHighlightedQuote = (
  text: string,
  highlight?: string,
): Array<JSX.Element | string> => {
  if (!highlight || !text.includes(highlight)) {
    return [text]
  }

  const segments = text.split(highlight)

  return segments.flatMap((segment, index) => {
    const isLast = index === segments.length - 1

    return [
      segment,
      !isLast ? (
        <span
          key={`highlight-${index}`}
          className="text-[color:var(--learning-principles-accent)]">
          {highlight}
        </span>
      ) : null,
    ].filter(Boolean) as Array<JSX.Element | string>
  })
}

export const LearningPrinciplesBlock: FC<OwnPropertyType> = ({
  className,
  items,
  quote,
  theme,
  sectionTitle = LEARNING_PRINCIPLES_SECTION_TITLE_DEFAULT,
  sectionSubtitle = LEARNING_PRINCIPLES_SECTION_SUBTITLE_DEFAULT,
  isEditMode = false,
  isDisabled = false,
  addPrincipleLabel = 'Добавить принцип',
  onAddPrincipleHandler,
  onRemovePrincipleHandler,
  onPrincipleFieldChangeHandler,
  onQuoteFieldChangeHandler,
  onMetadataFieldChangeHandler,
  onSaveHandler,
  actionLabel = 'Save block',
  isSubmitting = false,
}) => {
  if (!isEditMode && !items.length && !quote.text) {
    return null
  }

  const resolvedTheme = {
    ...DEFAULT_THEME,
    ...theme,
  }

  const cssVariables = buildThemeStyle(resolvedTheme)
  const canAddPrinciples = Boolean(isEditMode && onAddPrincipleHandler)
  const canRemovePrinciples = Boolean(isEditMode && onRemovePrincipleHandler)

  const handlePrincipleFieldChange = (
    index: number,
    field: keyof LearningPrincipleItemType,
    value: string,
  ) => {
    if (!onPrincipleFieldChangeHandler) {
      return
    }

    onPrincipleFieldChangeHandler({
      index,
      field,
      value,
    })
  }

  const handleQuoteFieldChange = (
    field: keyof LearningPrinciplesQuoteType,
    value: string,
  ) => {
    onQuoteFieldChangeHandler?.({
      field,
      value,
    })
  }

  const handleMetadataFieldChange = (
    field: LearningPrinciplesMetadataFieldChangePayloadType['field'],
    value: string,
  ) => {
    onMetadataFieldChangeHandler?.({
      field,
      value,
    })
  }

  if (!isEditMode) {
    const colors = {
      orange: resolvedTheme.accent,
      orangeDark: '#cc4d00',
      black: '#0a0a0a',
      white: '#ffffff',
      cream: '#f5f2eb',
      gray: '#666666',
      grayLight: '#999999',
      divider: '#dddddd',
    }

    return (
      <div
        className={className}
        style={{
          fontFamily: SERIF_FONT_FAMILY,
          background: colors.white,
          color: colors.black,
        }}>
        <section
          style={{
            background: colors.cream,
            padding: '64px 0',
            borderTop: `1px solid ${colors.divider}`,
            borderBottom: `1px solid ${colors.divider}`,
          }}>
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 40px',
            }}>
            {(sectionTitle || sectionSubtitle) && (
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                {sectionTitle ? (
                  <span
                    style={{
                      fontFamily: ACCENT_LABEL_FONT_FAMILY,
                      fontSize: '0.6875rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: colors.orange,
                      display: 'inline-block',
                    }}>
                    {sectionTitle}
                  </span>
                ) : null}
                {sectionSubtitle ? (
                  <h3
                    style={{
                      fontSize: '2.25rem',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      margin: '0.75rem 0 0 0',
                      color: resolvedTheme.textPrimary,
                    }}>
                    {sectionSubtitle}
                  </h3>
                ) : null}
              </div>
            )}

            {!!items.length && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '24px',
                }}>
                {items.map(({ numeral, title, description }, index) => (
                  <div
                    key={`principle-${index}`}
                    style={{
                      borderLeft: index > 0 ? '1px solid #ddd' : 'none',
                      paddingLeft: index > 0 ? '24px' : 0,
                    }}>
                    <div
                      style={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: resolvedTheme.accent,
                        lineHeight: 1,
                        marginBottom: '0.75rem',
                      }}>
                      {numeral}
                    </div>
                    <h4
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        margin: '0 0 0.75rem 0',
                        color: resolvedTheme.textPrimary,
                      }}>
                      {title}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        lineHeight: 1.7,
                        color: resolvedTheme.textMuted,
                        margin: 0,
                        textAlign: 'justify',
                      }}>
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {quote.text ? (
          <section
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '80px 40px',
              textAlign: 'center',
            }}>
            <blockquote
              style={{
                margin: 0,
                padding: '0 80px',
              }}>
              <div
                style={{
                  fontSize: '4rem',
                  color: resolvedTheme.accent,
                  lineHeight: 1,
                  marginBottom: '-20px',
                }}>
                "
              </div>
              <p
                style={{
                  fontSize: '2rem',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  color: resolvedTheme.textPrimary,
                  margin: '0 0 24px 0',
                }}>
                {renderHighlightedQuote(quote.text, quote.highlight).map(
                  (node, index) => (
                    <Fragment key={`${quote.text}-${index}`}>{node}</Fragment>
                  ),
                )}
              </p>
              <footer
                style={{
                  fontSize: '14px',
                  fontFamily: ACCENT_LABEL_FONT_FAMILY,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: resolvedTheme.quoteMuted,
                }}>
                {quote.author}
              </footer>
            </blockquote>
          </section>
        ) : null}
      </div>
    )
  }

  return (
    <section
      className={clsx(
        'w-full border-y border-[color:var(--learning-principles-divider)] bg-[color:var(--learning-principles-background)] text-[color:var(--learning-principles-text)]',
        className,
      )}
      style={{
        ...cssVariables,
        fontFamily: SERIF_FONT_FAMILY,
      }}>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-16 px-6 py-16 md:px-10">
        {canAddPrinciples && (
          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 rounded-(--radius) border border-(--border) bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-text)] transition hover:border-[color:var(--learning-principles-accent)]"
              onClick={onAddPrincipleHandler}
              disabled={isDisabled || isSubmitting}>
              <Plus className="h-4 w-4" />
              {addPrincipleLabel}
            </button>
          </div>
        )}

        {isEditMode ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                Титул
              </label>
              <input
                type="text"
                value={sectionTitle}
                disabled={isDisabled || isSubmitting}
                className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                onChange={event =>
                  handleMetadataFieldChange('title', event.target.value)
                }
                onBlur={() => onSaveHandler?.()}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                Подзаголовок
              </label>
              <input
                type="text"
                value={sectionSubtitle}
                disabled={isDisabled || isSubmitting}
                className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                onChange={event =>
                  handleMetadataFieldChange('subtitle', event.target.value)
                }
                onBlur={() => onSaveHandler?.()}
              />
            </div>
          </div>
        ) : (sectionTitle || sectionSubtitle) && (
          <div className="mx-auto max-w-4xl text-center space-y-3">
            {sectionTitle ? (
              <span
                style={{
                  fontFamily: ACCENT_LABEL_FONT_FAMILY,
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--learning-principles-accent)',
                  display: 'inline-block',
                }}>
                {sectionTitle}
              </span>
            ) : null}
            {sectionSubtitle ? (
              <h3
                style={{
                  fontFamily: SERIF_FONT_FAMILY,
                  fontSize: '36px',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  margin: '12px 0 0 0',
                  color: 'var(--learning-principles-text)',
                  lineHeight: 1.2,
                }}>
                {sectionSubtitle}
              </h3>
            ) : null}
          </div>
        )}

        {!!items.length && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start">
            {items.map(({ numeral, title, description }, index) => {
              const itemClassName = isEditMode
                ? 'space-y-4 rounded-(--radius) border border-[color:var(--learning-principles-divider)] bg-[color:var(--learning-principles-background)] p-4'
                : clsx(
                    'space-y-4 text-justify',
                    index > 0 && 'lg:border-l lg:pl-6',
                  )

              return (
                <div
                  key={`principle-${index}`}
                  className={itemClassName}>
                  {canRemovePrinciples && (
                    <div className="flex justify-end">
                      <IconCircleButton
                        icon={<Minus className="h-4 w-4" />}
                        aria-label="Удалить принцип"
                        onClick={() => onRemovePrincipleHandler?.(index)}
                        isDisabled={isDisabled || isSubmitting}
                      />
                    </div>
                  )}

                  {isEditMode ? (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                        Номер
                      </label>
                      <input
                        type="text"
                        value={numeral}
                        disabled={isDisabled || isSubmitting}
                        className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                        onChange={event =>
                          handlePrincipleFieldChange(
                            index,
                            'numeral',
                            event.target.value,
                          )
                        }
                        onBlur={() => onSaveHandler?.()}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                        Заголовок
                      </label>
                      <input
                        type="text"
                        value={title}
                        disabled={isDisabled || isSubmitting}
                        className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                        onChange={event =>
                          handlePrincipleFieldChange(
                            index,
                            'title',
                            event.target.value,
                          )
                        }
                        onBlur={() => onSaveHandler?.()}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                        Описание
                      </label>
                      <textarea
                        value={description}
                        disabled={isDisabled || isSubmitting}
                        className="min-h-[140px] w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                        onChange={event =>
                          handlePrincipleFieldChange(
                            index,
                            'description',
                            event.target.value,
                          )
                        }
                        onBlur={() => onSaveHandler?.()}
                      />
                    </div>
                  </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontFamily: SERIF_FONT_FAMILY,
                          fontSize: '48px',
                          fontWeight: 700,
                          lineHeight: 1,
                          color: 'var(--learning-principles-accent)',
                          marginBottom: '12px',
                        }}>
                        {numeral}
                      </div>
                      <h4
                        style={{
                          fontFamily: SERIF_FONT_FAMILY,
                          fontSize: '18px',
                          fontWeight: 700,
                          margin: '0 0 12px 0',
                          color: 'var(--learning-principles-text)',
                        }}>
                        {title}
                      </h4>
                      <p
                        style={{
                          fontFamily: SERIF_FONT_FAMILY,
                          fontSize: '14px',
                          lineHeight: 1.7,
                          color: 'var(--learning-principles-muted)',
                          margin: 0,
                        }}>
                        {description}
                      </p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {quote.text || isEditMode ? (
          <div className="w-full">
            {isEditMode ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                    Текст цитаты
                  </label>
                  <textarea
                    value={quote.text}
                    disabled={isDisabled || isSubmitting}
                    className="min-h-[160px] w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                    onChange={event =>
                      handleQuoteFieldChange('text', event.target.value)
                    }
                    onBlur={() => onSaveHandler?.()}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                      Подсветка
                    </label>
                  <input
                    type="text"
                    value={quote.highlight || ''}
                    disabled={isDisabled || isSubmitting}
                    className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                      onChange={event =>
                        handleQuoteFieldChange('highlight', event.target.value)
                      }
                      onBlur={() => onSaveHandler?.()}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--learning-principles-muted)]">
                      Автор
                    </label>
                  <input
                    type="text"
                    value={quote.author}
                    disabled={isDisabled || isSubmitting}
                    className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-[color:var(--learning-principles-text)] outline-none"
                      onChange={event =>
                        handleQuoteFieldChange('author', event.target.value)
                      }
                      onBlur={() => onSaveHandler?.()}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <blockquote className="mx-auto max-w-4xl text-center">
                <div className="text-6xl leading-none text-[color:var(--learning-principles-accent)]">
                  "
                </div>
                <p className="mt-4 text-2xl italic leading-relaxed">
                  {renderHighlightedQuote(quote.text, quote.highlight).map(
                    (node, index) => (
                      <Fragment key={`${quote.text}-${index}`}>{node}</Fragment>
                    ),
                  )}
                </p>
                <footer className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--learning-principles-quote-muted)]">
                  {quote.author}
                </footer>
              </blockquote>
            )}
          </div>
        ) : null}

      </div>
    </section>
  )
}
