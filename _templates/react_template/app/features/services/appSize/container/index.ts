'use client'

import { useEffect } from 'react'
import { useSizeDetect } from '@infinityloop.labs/utils'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'
import { MOBILE_BREAKPOINT } from '../constants'

// Комментировать только логические блоки внутри useContainer, return не комментировать;
// Все логические блоки должны быть покрыты комментариями
// Описание: Начало
// Описание: Конец
// Старые комментарии не удалять — обновлять при изменении структуры.
// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы; булевы с префиксами is/has/should/can.
// Функции именовать on***Handler.
// Полные осмысленные имена переменных и функций.
// Запрещено: использовать useCallback/useMemo - это делает react compiler
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// Типы создаются и хранятся в ../lib/types/index.ts
// Данные из backend -> UI / UI -> backend пропускаются через слой ../lib/mappers/index.ts
// При работе с формами использовать useForm<HeaderFieldsType> и схему из ../lib/mappers/schemas/index.ts
// SC из глобального импорта, запрещающий вставлять что-то в аргументы контейнера
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE

export const useContainer: SC = () => {
  const { innerWidth, innerHeight, clientWidth, clientHeight } = useSizeDetect()
  const { isMobile } = useAppSelector(state => state.appSize)

  // Определение текущей ширины экрана: Начало
  const isMobileWidth = Boolean(innerWidth <= MOBILE_BREAKPOINT)
  // Определение текущей ширины экрана: Конец

  const {
    appSize: { setIsMobile, setAppSize, setScreenFlagsByWidth },
  } = useAppActions()

  // Синхронизация мобильного флага: Начало
  useEffect(() => {
    if (isMobileWidth !== isMobile) {
      setIsMobile(isMobileWidth)
    }
  }, [isMobile, isMobileWidth])
  // Синхронизация мобильного флага: Конец

  // Обновление breakpoints: Начало
  useEffect(() => {
    setScreenFlagsByWidth(innerWidth)
  }, [innerWidth, setScreenFlagsByWidth])
  // Обновление breakpoints: Конец

  // Сохранение текущих размеров приложения: Начало
  useEffect(() => {
    setAppSize({
      clientHeight,
      clientWidth,
      innerHeight,
      innerWidth,
    })
  }, [clientHeight, clientWidth, innerHeight, innerWidth])
  // Сохранение текущих размеров приложения: Конец
}
