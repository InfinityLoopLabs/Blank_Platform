import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'
import type { UIPropertyType } from '../ui'

export const useContainer: CC<UIPropertyType> = () => {
  // Чтение данных из store: Начало
  const { modals } = useAppSelector(state => state.popup)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const {
    popup: { removeModal },
  } = useAppActions()
  // Работа с данными из store: Конец

  return {
    modals,
    onCloseHandler: removeModal,
  }
}
