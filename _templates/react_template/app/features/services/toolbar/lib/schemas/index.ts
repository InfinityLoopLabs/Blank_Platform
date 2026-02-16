import { object, ObjectSchema, string } from 'yup'
import { ToolbarFieldsEnum, type ToolbarFieldsType } from '../types'

// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts

// Схема для формы Toolbar: Начало
export const toolbarSchema: ObjectSchema<ToolbarFieldsType> = object({
  [ToolbarFieldsEnum.FIELD]: string(),
})
// Схема для формы Toolbar: Конец
