import React from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'
import { dti } from '../../constants'

// В UI и templates запрещено использование хуков и логики — только рендер данных, полученных из контейнера.
//
// Типизация функций всегда через Callback<Value, ReturnType> или VoidFunction.
// Value — тип аргумента, ReturnType — тип возврата, по умолчанию void.
// VoidFunction — без аргументов и возвращаемого значения.
//
// Без React.memo - используется react compiler
//
// Комментирование вёрстки: {/* Описание: Начало */} <Flex> </Flex> {/* Описание: Конец */}.
// Комментировать только логические блоки, не каждую строку.
// Старые комментарии не удалять — обновлять только при изменении структуры блока.
//
// Для отображения массивов использовать только ArrayRender. import { ArrayRender } from "@infinityloop.labs/utils"
// Принимает items (массив элементов) и renderItem={(item=><JSX key={item.id} /> /)}
// Исключение — случаи, когда библиотека требует прямой map-рендер (например, слайдеры или карусели).
//
// В className использовать clsx import { clsx } from "@infinityloop.labs/utils"
//
// Для формы использовать типизацию control: UseFormControlType<SampleFieldsEnum>
// import type { SampleFieldsEnum } from '../lib/types'
// import type { UseFormControlType } from '@lib/types'
// Для компонентов использовать <Controller/>
//
// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы; булевы с префиксами is/has/should/can.
// Функции именовать on***Handler.
// Полные осмысленные имена переменных и функций.
// Запрещено: использовать useCallback/useMemo React.memo - это делает react compiler
// Все magic number/strings описывать в ../../constants добавить reexport в ../constants/index.ts
// Типы создаются и хранятся в ../../lib/types/index.ts
// Данные из backend -> UI / UI -> backend пропускаются через слой ../../lib/mappers/index.ts
// При работе с формами использовать useForm<SampleFieldsType> и схему из ../../lib/mappers/schemas/index.ts
// Запрещено удалять комментарии
// Запрещено переименовывать OwnPropertyType
// Строго соблюдать правила в комментариях при чтении/парсинге файла
//
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE

const dtiDictionary = {
  mainDiv: 'Sample',
}

type OwnPropertyType = {}

export const Sample: FC<OwnPropertyType> = ({}) => (
  <Flex data-testid={`${dti}${dtiDictionary.mainDiv}`} className={clsx('')}>
    {}
  </Flex>
)
