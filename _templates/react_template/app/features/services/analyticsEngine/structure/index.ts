// Типы создаются и хранятся в ../lib/types/index.ts
// Запрещено создавать тип для initialState
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// Запрещено создавать функции в этом файле

import type {
  ScrollStopPointWebClientType,
  ScrollGuardWebClientType,
} from '../lib/'

export const initialState = {
  isAnalyticsEngineInitialized: false,
  scrollStopPoints: [] as ScrollStopPointWebClientType[],
  guardPassPoints: [] as ScrollGuardWebClientType[],
  yScrollPointsArray: [] as number[],

  isUpperScrolling: true,
  isDownScrolling: false,

  currentBlocksInViewport: [] as string[],
}
