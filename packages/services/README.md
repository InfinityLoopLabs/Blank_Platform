# services

Reusable Redux Toolkit setup for React applications.

## Install

```bash
npm i @infinityloop.labs/services
```

## Usage

```ts
import { combineReducers, createServicesStore, createReduxHooks } from '@infinityloop.labs/services'

const reducer = combineReducers({
  // your reducers
})

export const store = createServicesStore({ reducer })

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const { useAppDispatch, useAppSelector } = createReduxHooks<RootState, AppDispatch>()
```
