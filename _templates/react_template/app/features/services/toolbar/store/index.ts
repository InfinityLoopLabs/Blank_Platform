import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants'
import { initialState } from '../structure'

// Типы создаются и хранятся в ../lib/types/index.ts
// Запрещено создавать тип для initialState
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// В этом файле запрещено создавать функции кроме reducers

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setToolbarInitialized(
      state,
      action: PayloadAction<typeof initialState.isToolbarInitialized>,
    ) {
      state.isToolbarInitialized = action.payload
    },
    setIsEditModeEnabled(
      state,
      action: PayloadAction<typeof initialState.isEditModeEnabled>,
    ) {
      state.isEditModeEnabled = action.payload
    },
    setIsReorderModeEnabled(
      state,
      action: PayloadAction<typeof initialState.isReorderModeEnabled>,
    ) {
      state.isReorderModeEnabled = action.payload
    },
    setIsEditModeControlVisible(
      state,
      action: PayloadAction<typeof initialState.isEditModeControlVisible>,
    ) {
      state.isEditModeControlVisible = action.payload
    },
    setIsReorderModeControlVisible(
      state,
      action: PayloadAction<typeof initialState.isReorderModeControlVisible>,
    ) {
      state.isReorderModeControlVisible = action.payload
    },
    setIsActiveBlockToolBarVisible(
      state,
      action: PayloadAction<typeof initialState.isActiveBlockToolBarVisible>,
    ) {
      state.isActiveBlockToolBarVisible = action.payload
    },
    setIsEditBlockToolBarVisible(
      state,
      action: PayloadAction<typeof initialState.isEditBlockToolBarVisible>,
    ) {
      state.isEditBlockToolBarVisible = action.payload
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
