// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы/enums; булевы с префиксами is/has/should/can.
// Naming: Использовать типы вместо интерфейсов, с окончанием Type в конец названия - как в SampleDTOType
// Naming: При использовании enum добавлять Enum в конец названия - как в SampleFieldsEnum
// Запрещено удалять комментарии
// Запрещено создавать тип для функций

// Адаптер для типа DTO из swagger для UI
export type SampleDTOType = object

export type ScrollStopPointWebClientType = {
  id: string
  timestamp: Date
}

export type ScrollGuardWebClientType = {
  id: string
  timestamp: Date
}

// Типизация формы Sample: Начало
export const enum SampleFieldsEnum {
  FIELD = 'FIELD',
}

export type SampleFieldsType = Record<SampleFieldsEnum, Nullable<string>>
// Типизация формы Sample: Конец
