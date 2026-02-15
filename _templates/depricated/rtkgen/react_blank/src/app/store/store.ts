import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { generatedMiddlewaresList } from '@app/store/generated/middlewares'
import { reducersList } from './reducers'

const rootReducer = combineReducers(reducersList)

export const store = configureStore({
  reducer: rootReducer,
  // @ts-ignore
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      // Добавляем автоматические middleware сгенерированные библиотекой @rtk-query/codegen-openapi
      .concat(...generatedMiddlewaresList),
  devTools: process.env.NODE_ENV !== 'production',
})

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.store = store
}

export type AppStateType = ReturnType<typeof rootReducer>
export type AppDispatchType = typeof store.dispatch
