import { Reducer as analyticsEngine } from '@services/analyticsEngine'
import { Reducer as appSize } from '@services/appSize'
import { Reducer as auth } from '@services/auth'
import { Reducer as chartPopover } from '@services/chartPopover'
import { Reducer as forms } from '@services/forms'
import { Reducer as indexeddb } from '@services/indexeddb'
import { Reducer as notify } from '@services/notify'
import { Reducer as popup } from '@services/popup'
import { Reducer as progress } from '@services/progress'
import { Reducer as roles } from '@services/roles'
import { Reducer as router } from '@services/router'
import { Reducer as theme } from '@services/theme'
import { Reducer as toolbar } from '@services/toolbar'
import { Reducer as Breadcrumbs } from '@widgets/Breadcrumbs'
import { generatedReducersList } from '@application/store/generated/reducers'
import { Reducer as palette } from '@services/palette'
import { Reducer as Lootbox } from '@widgets/Lootbox'

export const reducersList = {
  // Services: Начало
palette,
  toolbar,
  roles,
  analyticsEngine,
  chartPopover,
  progress,
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
Lootbox,
  Breadcrumbs,
  // Widgets: Конец

  // Auto Generated Reducers: Начало
  ...generatedReducersList,
  // Auto Generated Reducers: Конец
}
