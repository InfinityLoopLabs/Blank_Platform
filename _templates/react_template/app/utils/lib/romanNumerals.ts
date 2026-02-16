const ROMAN_NUMERAL_RULES: ReadonlyArray<{ value: number; numeral: string }> = [
  { value: 1000, numeral: 'M' },
  { value: 900, numeral: 'CM' },
  { value: 500, numeral: 'D' },
  { value: 400, numeral: 'CD' },
  { value: 100, numeral: 'C' },
  { value: 90, numeral: 'XC' },
  { value: 50, numeral: 'L' },
  { value: 40, numeral: 'XL' },
  { value: 10, numeral: 'X' },
  { value: 9, numeral: 'IX' },
  { value: 5, numeral: 'V' },
  { value: 4, numeral: 'IV' },
  { value: 1, numeral: 'I' },
]

export const convertNumberToRomanNumeral = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) {
    return ''
  }

  let remainingValue = Math.floor(value)
  let result = ''

  ROMAN_NUMERAL_RULES.forEach(rule => {
    while (remainingValue >= rule.value) {
      result += rule.numeral
      remainingValue -= rule.value
    }
  })

  return result
}

export const resolveRomanNumeralFromIndex = (index: number): string => {
  const resolvedValue = convertNumberToRomanNumeral(index + 1)

  return resolvedValue || String(index + 1)
}
