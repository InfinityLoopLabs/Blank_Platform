import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { QueryParametersEnum, RoutesEnum } from '@constants/local'
import { name } from '../constants/name'
import { initialState } from '../structure'

// Типы создаются и хранятся в ../lib/types/index.ts
// Запрещено создавать тип для initialState
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// В этом файле запрещено создавать функции кроме reducers

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    // Заменить хранилище query params полностью
    setQueryParameters: (
      state,
      action: PayloadAction<typeof initialState.filters>,
    ) => {
      state.filters = action.payload
    },
    // Заменить один элемент в хранилище query params
    setQueryParameter: (
      state,
      action: PayloadAction<{
        key: QueryParametersEnum
        value: Nullable<string | number | boolean>
      }>,
    ) => {
      state.filters[action.payload.key] = action.payload.value
    },
    setIsRouterInitialized: (state, action: PayloadAction<boolean>) => {
      state.isRouterInitialized = action.payload
    },
    setPathNameFlags: (state, action: PayloadAction<RoutesEnum>) => {
      const pagesState = initialState.pages
      state.pages = {
        ...pagesState,
        [`/${action.payload || RoutesEnum.COURSES.replaceAll('/', '')}`]: true,
      }
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
