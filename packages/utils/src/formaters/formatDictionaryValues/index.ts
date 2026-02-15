/**
 * Форматирует значение из словаря.
 *
 * @template T - Тип ключа словаря (строка).
 * @param {T} value - Значение для форматирования.
 * @param {Record<T, string>} enumObject - Объект словаря.
 * @returns {string} Отформатированное значение или исходное значение, если оно не найдено в словаре.
 */
export const formatDictionaryValues = <T extends string>(
  value: T,
  enumObject: Record<T, string>
) => {
  if (value && value in enumObject) {
    return enumObject[value]
  }

  return value || '-'
}
