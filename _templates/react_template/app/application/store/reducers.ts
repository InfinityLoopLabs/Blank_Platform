import { Reducer as analyticsEngine } from '@services/analyticsEngine'
import { Reducer as appSize } from '@services/appSize'
import { Reducer as auth } from '@services/auth'
import { Reducer as forms } from '@services/forms'
import { Reducer as indexeddb } from '@services/indexeddb'
import { Reducer as notify } from '@services/notify'
import { Reducer as popup } from '@services/popup'
import { Reducer as roles } from '@services/roles'
import { Reducer as router } from '@services/router'
import { Reducer as theme } from '@services/theme'

import { generatedReducersList } from '@application/store/generated/reducers'

export const reducersList = {
  // Services: Начало
  roles,
  analyticsEngine,
  appSize,
  auth,
  forms,
  indexeddb,
  notify,
  popup,
  router,
  theme,
  // Services: Конец

  // Widgets: Начало

  // Widgets: Конец

  // Auto Generated Reducers: Начало
  ...generatedReducersList,
  // Auto Generated Reducers: Конец
}
