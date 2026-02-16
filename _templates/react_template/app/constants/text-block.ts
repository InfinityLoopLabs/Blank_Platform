// Все константы пишутся в SCREAMING_SNAKE_CASE.
// Полные осмысленные имена.
// Запрещены одиночные буквы (a, b, c, x, y, z) и бессмысленные сокращения.

export const TEXT_BLOCK_VARIANTS = {
  PARAGRAPH: 'paragraph',
  RICH_TEXT: 'rich_text',
  VIZ_DOT: 'viz_dot',
} as const

export type TextBlockVariantType =
  (typeof TEXT_BLOCK_VARIANTS)[keyof typeof TEXT_BLOCK_VARIANTS]
