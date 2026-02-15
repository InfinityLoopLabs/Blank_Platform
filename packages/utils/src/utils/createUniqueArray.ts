export const createUniqueArray = <T>(array: T[]): T[] =>
  Array.from(new Set(array))
