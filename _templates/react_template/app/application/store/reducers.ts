import {
  appSizeReducer,
  formsReducer,
  indexeddbReducer,
  notifyReducer,
  popupReducer,
  routerReducer,
  themeReducer,
} from '@infinityloop.labs/fronted-core'
import { Reducer as analyticsEngine } from '@services/analyticsEngine'
import { Reducer as auth } from '@services/auth'
import { Reducer as roles } from '@services/roles'

import { generatedReducersList } from '@application/store/generated/reducers'

export const reducersList = {
  // Services: Начало
  roles,
  analyticsEngine,
  appSize: appSizeReducer,
  auth,
  forms: formsReducer,
  indexeddb: indexeddbReducer,
  notify: notifyReducer,
  popup: popupReducer,
  router: routerReducer,
  theme: themeReducer,
  // Services: Конец

  // Widgets: Начало

  // Widgets: Конец

  // Auto Generated Reducers: Начало
  ...generatedReducersList,
  // Auto Generated Reducers: Конец
}
