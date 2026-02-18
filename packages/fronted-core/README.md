# fronted-core

Reusable services for React + Redux Toolkit projects, including popup service integration with `@infinityloop.labs/event-bus`.

## Install

```bash
npm i @infinityloop.labs/fronted-core
```

## Popup service

```ts
import { Actions, Reducer, popup } from '@infinityloop.labs/fronted-core'

// reducer
const reducer = combineReducers({
  popup: Reducer,
})

// global service injector usage
// <ServiceInjector services={[popup.service]} />

// actions
Actions.addModal({ id: 'id', title: 'Title' })
Actions.removeModal({ id: 'id' })
```
