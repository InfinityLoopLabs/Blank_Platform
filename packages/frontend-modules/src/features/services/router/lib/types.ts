export type RouterQueryParamValueType =
  | boolean
  | boolean[]
  | null
  | number
  | number[]
  | string
  | string[]
  | undefined

export type RouterQueryParamsType = Record<string, RouterQueryParamValueType>
