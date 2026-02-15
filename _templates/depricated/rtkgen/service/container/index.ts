import { useEffect } from 'react'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'

export const useContainer: SC = () => {
  // Чтение данных из store: Начало
  const {} = useAppSelector(state => state)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const {} = useAppActions()
  // Работа с данными из store: Конец

  useEffect(() => {}, [])
}
