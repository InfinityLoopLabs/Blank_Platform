# frontend-modules

Reusable services for React + Redux Toolkit projects, including popup service integration with `@infinityloop.labs/event-bus`.

## Install

```bash
npm i @infinityloop.labs/frontend-modules
```

## Popup service

```ts
import { Actions, Reducer, popup } from '@infinityloop.labs/frontend-modules'

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
