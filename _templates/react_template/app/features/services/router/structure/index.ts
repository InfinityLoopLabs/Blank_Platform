import { RoutesEnum } from '@constants/routes'
import type { RouterQueryParamsType } from '../lib/types'

// Типы создаются и хранятся в ../lib/types/index.ts
// Запрещено создавать тип для initialState
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// Запрещено создавать функции в этом файле

export const initialState = {
  filters: {} as RouterQueryParamsType,
  isRouterInitialized: false,
  pages: {
    [RoutesEnum.COURSE]: false,
    [RoutesEnum.PREVIEW]: false,
    [RoutesEnum.COURSES]: false,
    [RoutesEnum.LOGIN]: false,
  } as Record<RoutesEnum, boolean>,
}
