import { object, ObjectSchema, string } from 'yup'
import { SampleFieldsEnum, type SampleFieldsType } from '../types'

// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts

// Схема для формы Sample: Начало
export const sampleSchema: ObjectSchema<SampleFieldsType> = object({
  [SampleFieldsEnum.FIELD]: string(),
})
// Схема для формы Sample: Конец
