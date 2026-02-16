import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { NotifyType } from '@services/notify/lib/types'
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

const slice = createSlice({
  name,
  initialState,
  reducers: {
    addNotify: (state, action: PayloadAction<NotifyType>) => {
      state.notifyArray.push(action.payload)
    },
    removeNotify: state => {
      state.notifyArray.shift()
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
