type PrimitiveType = string | number | boolean
export type SelectedFiltersType = {
  [param: string]:
    | PrimitiveType
    | PrimitiveType[]
    | Record<string, PrimitiveType>[]
    | null
    | undefined
}

/**
 * The createQueryParams function takes an object of key-value pairs and returns a string that can be used as the query params in a URL.
 * @example const params = createQueryParams({ page:1, size:10 })
 *
 * @return A string of the form:
 *
 */
export const createQueryParams = (params: SelectedFiltersType) =>
  Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const filteredValues = value.filter(v => v != null)

        if (typeof value === 'object') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(
            JSON.stringify(value),
          )}`
        }

        return `${encodeURIComponent(key)}=${encodeURIComponent(
          filteredValues.join(','),
        )}`
      }

      if ((!value && value !== 0) || !key) {
        return ''
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(part => part !== '')
    .join('&')
