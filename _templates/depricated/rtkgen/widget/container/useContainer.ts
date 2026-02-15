import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'
import { UIPropertyType } from '../ui'

export const useContainer: CC<UIPropertyType> = () => {
  // Функция перевода: Начало
  const { t } = useTranslation()
  // Функция перевода: Конец

  // Чтение данных из store: Начало
  const {} = useAppSelector(state => state)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const {} = useAppActions()
  // Работа с данными из store: Конец

  useEffect(() => {}, [])

  return { t }
}
