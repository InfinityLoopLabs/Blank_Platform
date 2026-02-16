// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы/enums; булевы с префиксами is/has/should/can.
// Naming: Использовать типы вместо интерфейсов, с окончанием Type в конец названия - как в SampleDTOType
// Naming: При использовании enum добавлять Enum в конец названия - как в SampleFieldsEnum
// Запрещено удалять комментарии
// Запрещено создавать тип для функций
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts

// Адаптер для типа DTO из swagger для UI
export type SampleRequestDTOType = object
export type SampleResponseDTOType = object

// UI: Начало
export type SampleUIType = {}

export type SampleWebClientType = {}
// UI: Конец

// Типизация формы Sample: Начало
export const enum SampleFieldsEnum {
  FIELD = 'FIELD',
}

export type SampleFieldsType = Record<SampleFieldsEnum, Nullable<string>>
// Типизация формы Sample: Конец
