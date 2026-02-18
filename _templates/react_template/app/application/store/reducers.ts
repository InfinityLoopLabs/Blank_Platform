import {
  appSizeReducer,
  formsReducer,
  indexeddbReducer,
  popupReducer,
  routerReducer,
} from '@infinityloop.labs/fronted-core'
import { Reducer as analyticsEngine } from '@services/analyticsEngine'
import { Reducer as auth } from '@services/auth'
import { Reducer as notify } from '@services/notify'
import { Reducer as roles } from '@services/roles'
import { Reducer as theme } from '@services/theme'

import { generatedReducersList } from '@application/store/generated/reducers'

export const reducersList = {
  // Services: Начало
  roles,
  analyticsEngine,
  appSize: appSizeReducer,
  auth,
  forms: formsReducer,
  indexeddb: indexeddbReducer,
  notify,
  popup: popupReducer,
  router: routerReducer,
  theme,
  // Services: Конец

  // Widgets: Начало

  // Widgets: Конец

  // Auto Generated Reducers: Начало
  ...generatedReducersList,
  // Auto Generated Reducers: Конец
}
