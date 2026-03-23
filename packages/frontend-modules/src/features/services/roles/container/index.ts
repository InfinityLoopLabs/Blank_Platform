'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRolesActions } from '../hooks/useRolesActions'
import { initialState } from '../structure'

type RolesSliceStateType = {
  roles: typeof initialState
}

export const useContainer: SC = () => {
  // Чтение данных из store: Начало
  const rolesState = useSelector((state: RolesSliceStateType) => state.roles)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const rolesActions = useRolesActions()
  // Работа с данными из store: Конец

  // Заглушка до реализации бизнес-логики: Начало
  useEffect(() => {
    void rolesState
    void rolesActions
  }, [rolesState, rolesActions])
  // Заглушка до реализации бизнес-логики: Конец
}
