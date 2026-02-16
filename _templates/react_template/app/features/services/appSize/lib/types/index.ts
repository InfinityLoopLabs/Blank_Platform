// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы/enums; булевы с префиксами is/has/should/can.
// Naming: Использовать типы вместо интерфейсов, с окончанием Type в конец названия - как в SampleDTOType
// Naming: При использовании enum добавлять Enum в конец названия - как в SampleFieldsEnum
// Запрещено удалять комментарии
// Запрещено создавать тип для функций
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts

export type ScreenFlagStateType = {
  isSM: boolean
  isMD: boolean
  isLG: boolean
  isXL: boolean
  is2XL: boolean
}

export type ScreenFlagKeyType = keyof ScreenFlagStateType
