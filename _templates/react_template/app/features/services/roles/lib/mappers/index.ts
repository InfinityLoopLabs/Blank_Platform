import type { RolesDTOType, RolesUIType } from '../types'

// Паттерн: Mapper (слой преобразования данных).
// Правило чистой архитектуры: разделение моделей между слоями (DTO ↔ UI).
// Mapper'ы изолируют UI от изменений контрактов backend и наоборот.
// Любые преобразования формата данных выполняются только здесь.
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts

export const mapRolesFromDTOtoUI = (
  dto: RolesDTOType,
): Nullable<RolesUIType> => {
  if (dto) {
    return dto
  }

  return null
}

export const mapRolesFromUItoDTO = (
  ui: RolesUIType,
): Nullable<RolesDTOType> => {
  if (ui) {
    return ui
  }

  return null
}
