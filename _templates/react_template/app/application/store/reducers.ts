import {
  analyticsEngineReducer,
  appSizeReducer,
  authReducer,
  formsReducer,
  indexeddbReducer,
  notifyReducer,
  popupReducer,
  rolesReducer,
  routerReducer,
  themeReducer,
} from '@infinityloop.labs/frontend-modules'

import { generatedReducersList } from '@application/store/generated/reducers'

export const reducersList = {
  // Services: Начало
  roles: rolesReducer,
  analyticsEngine: analyticsEngineReducer,
  appSize: appSizeReducer,
  auth: authReducer,
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
