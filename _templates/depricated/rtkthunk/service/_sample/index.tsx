import { RestAPI } from './api'
import { useContainer } from './container'
import * as Selectors from './mappers'
import { Actions, Reducer } from './store'

export const sample = {
  service: useContainer,
}

export { Actions, Reducer, RestAPI, Selectors }
