'use client'

import { useEffect } from 'react'
import { setToLocalStorage } from '@infinityloop.labs/utils'
import { LocalStorageEnum } from '@constants/localstorage'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'
import { setNeonVars } from '@services/palette'

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
// Нейминг данных из кверей должен быть такой:
// const {
//   data: paletteData,
//   isLoading: isPaletteLoading,
//   isSuccess: isGetPaletteSuccess,
//   isError: isGetPaletteError,
//   refetch: refetchPalette,
// } = useGetPaletteByIdQuery({})
// Нейминг данных из мутаций должен быть такой:
// const [
//   updatePaletteTrigger или createPaletteTrigger,
//   {
//   data: paletteData,
//   isLoading: isPaletteLoading,
//   isSuccess: isGetPaletteSuccess,
//   isError: isGetPaletteError,
//   refetch: refetchPalette,
//   },
// ] = useUpdateDraftMutation()

export const useContainer: SC = () => {
  // Чтение данных из store: Начало
  const { neonColor } = useAppSelector(state => state.palette)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const {} = useAppActions()
  // Работа с данными из store: Конец

  useEffect(() => {
    const normalizedNeonColor = neonColor?.trim() || ''
    if (normalizedNeonColor.length === 7) {
      const isHexColorValue =
        /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
          normalizedNeonColor,
        )
      // setNeonVars('#b30b51')
      // setNeonVars('#7c3aed')
      if (isHexColorValue) {
        setNeonVars(normalizedNeonColor)
        setToLocalStorage(LocalStorageEnum.NEON_MAIN_COLOR, normalizedNeonColor)
      }
    }
  }, [neonColor])
}
