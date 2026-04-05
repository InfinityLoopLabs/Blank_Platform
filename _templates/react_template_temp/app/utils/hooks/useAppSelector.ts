import type { AppStateType } from '@application/store/store'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

/**
 * Типизированный адаптер для стандартного хука useSelector из библиотеки react-Redux.
 *
 * @description
 * Этот хук обеспечивает привязку к типу состояния приложения, указанному в AppStateType,
 * что облегчает работу с типами TypeScript и упрощает извлечение данных из хранилища Redux.
 *
 * Если в будущем потребуется заменить Redux на другую библиотеку для управления состоянием
 * (например, MobX или Zustand), достаточно будет изменить реализацию только в этом хуке.
 * После замены реализации все компоненты, использующие useAppSelector, продолжат работать корректно,
 * так как они будут использовать адаптированный хук с новой реализацией.
 *
 * useAppSelector служит удобным адаптером между компонентами и библиотекой управления состоянием,
 * обеспечивая гибкость и абстракцию от конкретной реализации.
 *
 * @type {TypedUseSelectorHook<AppStateType>}
 */
export const useAppSelector: TypedUseSelectorHook<AppStateType> = useSelector
