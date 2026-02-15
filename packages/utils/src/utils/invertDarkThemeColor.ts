/**
 * This function is used to invert a CSS color class for dark theme application.
 * It takes a single parameter, `color`, which represents the base color class to be inverted.
 * The function returns a string that represents an inverted CSS class for dark theme usage.
 *
 * @param color - The base color class to be inverted for dark theme.
 * @returns A string representing an inverted CSS class in the format: `${color}-dark dark:${color}`.
 *
 * @example
 * ```typescript
 * const baseColor = 'bg-red';
 * const invertedColor = invertDarkThemeColor(baseColor);
 * console.log(invertedColor); // Output: 'bg-red-dark dark:bg-red'
 * ```
 */
export const invertDarkThemeColor = (color: string) =>
  `${color}-dark dark:${color}`
