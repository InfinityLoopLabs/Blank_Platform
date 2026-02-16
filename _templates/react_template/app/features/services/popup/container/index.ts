import {
  EventTransferActionsEnum,
  useSubscribe,
} from '@infinityloop.labs/event-bus'
import { useAppActions } from '@hooks/useAppActions'

// Комментировать только логические блоки внутри useContainer, return не комментировать;
// Все логические блоки должны быть покрыты комментариями
// Описание: Начало
// Описание: Конец
// Старые комментарии не удалять — обновлять при изменении структуры.
// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы; булевы с префиксами is/has/should/can.
// Функции именовать on***Handler.
// Полные осмысленные имена переменных и функций.
// Запрещено: использовать useCallback/useMemo - это делает react compiler
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// Типы создаются и хранятся в ../lib/types/index.ts
// Данные из backend -> UI / UI -> backend пропускаются через слой ../lib/mappers/index.ts
// При работе с формами использовать useForm<HeaderFieldsType> и схему из ../lib/mappers/schemas/index.ts
// SC из глобального импорта, запрещающий вставлять что-то в аргументы контейнера
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE

export const useContainer: SC = () => {
  // Работа с данными из store: Начало
  const {
    popup: { addModal, removeModal },
  } = useAppActions()
  // Работа с данными из store: Конец

  useSubscribe({
    type: EventTransferActionsEnum.AddPopUp,
    callback: addModal,
  })

  useSubscribe({
    type: EventTransferActionsEnum.RemovePopUp,
    callback: removeModal,
  })
}
