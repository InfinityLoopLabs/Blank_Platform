import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants/name'
import { PopupType } from '../lib/types'
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
    addModal(state, action: PayloadAction<PopupType>) {
      state.modals[action.payload.id] = action.payload
    },
    removeModal(state, action: PayloadAction<{ id: string }>) {
      delete state.modals[action.payload.id]
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
