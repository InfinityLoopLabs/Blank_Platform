import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { TAILWIND_SCREEN_BREAKPOINTS, name } from '../constants/'
import { initialState } from '../structure'

// Типы создаются и хранятся в ../lib/types/index.ts
// Запрещено создавать тип для initialState
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// В этом файле запрещено создавать функции кроме reducers
// В этом файле запрещено создавать функции кроме reducers

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setIsMobile(state, action: PayloadAction<typeof initialState.isMobile>) {
      state.isMobile = action.payload
    },
    setScreenFlagsByWidth(state, action: PayloadAction<number>) {
      const safeWidth = Number.isFinite(action.payload) ? action.payload : 0

      state.screenFlags = {
        isSM: safeWidth >= TAILWIND_SCREEN_BREAKPOINTS.sm,
        isMD: safeWidth >= TAILWIND_SCREEN_BREAKPOINTS.md,
        isLG: safeWidth >= TAILWIND_SCREEN_BREAKPOINTS.lg,
        isXL: safeWidth >= TAILWIND_SCREEN_BREAKPOINTS.xl,
        is2XL: safeWidth >= TAILWIND_SCREEN_BREAKPOINTS['2xl'],
      }
    },
    setAppSize(state, action: PayloadAction<typeof initialState.appSize>) {
      state.appSize = action.payload
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
