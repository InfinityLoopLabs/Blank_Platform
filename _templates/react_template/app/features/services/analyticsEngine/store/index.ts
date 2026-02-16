import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants'
import type {
  ScrollGuardWebClientType,
  ScrollStopPointWebClientType,
} from '../lib'
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
    setAnalyticsEngineLoading(
      state,
      action: PayloadAction<typeof initialState.isAnalyticsEngineInitialized>,
    ) {
      state.isAnalyticsEngineInitialized = action.payload
    },
    addScrollStopPoint(
      state,
      action: PayloadAction<ScrollStopPointWebClientType>,
    ) {
      state.scrollStopPoints.push(action.payload)
    },
    addGuardPassPoint(state, action: PayloadAction<ScrollGuardWebClientType>) {
      state.guardPassPoints.push(action.payload)
    },
    addYScrollPoint(state, action: PayloadAction<number>) {
      const newState = [...state.yScrollPointsArray, action.payload]
      const length = newState.length

      if (length > 2) {
        newState.shift()
      }

      const firstPoint = newState[0]
      const secondPoint = newState[1]

      state.isDownScrolling = firstPoint < secondPoint
      state.isUpperScrolling = firstPoint > secondPoint

      state.yScrollPointsArray = [...newState]
    },
    clearAnalyticsPoints(state) {
      state.scrollStopPoints = []
      state.guardPassPoints = []
    },

    addBlockToViewportArray(state, action: PayloadAction<string>) {
      const set = new Set(state.currentBlocksInViewport)
      set.add(action.payload)
      state.currentBlocksInViewport = Array.from(set)
    },

    removeBlockFromViewportArray(state, action: PayloadAction<string>) {
      state.currentBlocksInViewport = state.currentBlocksInViewport.filter(
        block => block !== action.payload,
      )
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
