import { generatedReducersList } from '@app/store/generated/reducers'
import { Reducer as appSize } from '@services/appSize'

export const reducersList = {
  // Services: Начало
  appSize,
  // Services: Конец

  // Widgets: Начало
  // Widgets: Конец

  // Auto Generated Reducers: Начало
  ...generatedReducersList,
  // Auto Generated Reducers: Конец
}
