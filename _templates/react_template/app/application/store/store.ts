import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { generatedMiddlewaresList } from './generated/middlewares'
import { reducersList } from './reducers'

const rootReducer = combineReducers(reducersList)

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['auth.keycloakInstance', 'roles.permissions'],
        ignoredActions: [],
      },
    })
      // Добавляем автоматические middleware сгенерированные библиотекой @rtk-query/codegen-openapi
      .concat(...generatedMiddlewaresList),
  devTools: process.env.NODE_ENV !== 'production',
})

export type AppStateType = ReturnType<typeof rootReducer>
export type AppDispatchType = typeof store.dispatch
