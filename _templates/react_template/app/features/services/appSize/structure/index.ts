// Типы создаются и хранятся в ../lib/types/index.ts
// Запрещено создавать тип для initialState
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// Запрещено создавать функции в этом файле

export const initialState = {
  isMobile: false,
  isTablet: false,
  isHorizontal: false,
  screenFlags: {
    isSM: false,
    isMD: false,
    isLG: false,
    isXL: false,
    is2XL: false,
  },
  appSize: {
    innerWidth: null as Nullable<number>,
    innerHeight: null as Nullable<number>,
    clientWidth: null as Nullable<number>,
    clientHeight: null as Nullable<number>,
  },
}
