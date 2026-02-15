import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'
import { UIPropertyType } from '../ui'

export const useContainer: CC<UIPropertyType> = () => {
  // Функция перевода: Начало
  const { t } = useTranslation()
  // Функция перевода: Конец

  useEffect(() => {}, [])


  const {} = useAppActions()
  const {} = useAppSelector(state => state)

  return { t }
}
