import type { ToolbarWebClientType } from '../types'

// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts

export const toolbarHelper = (dto: ToolbarWebClientType) => {
  if (dto) {
    return dto
  }

  return null
}
