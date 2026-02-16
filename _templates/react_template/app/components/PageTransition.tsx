'use client'

import { useEffect, useState, useTransition } from 'react'
import { ArrayRender, clsx } from '@infinityloop.labs/utils'

// В UI запрещено использование хуков и логики — только рендер данных, полученных из контейнера.
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
// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы/enums; булевы с префиксами is/has/should/can.
// Naming: Использовать типы вместо интерфейсов, с окончанием Type в конец названия - как в SampleDTOType тип для компонента FC<OwnPropertyType> без импорта из react.
// FC импортируется из global без импорта
// Naming: При использовании enum добавлять Enum в конец названия - как в SampleFieldsEnum
// Запрещено удалять комментарии
// Запрещено создавать тип для функций

// Функции именовать on***Handler.
// Полные осмысленные имена переменных и функций.
// Запрещено: использовать useCallback/useMemo React.memo - это делает react compiler
// Все magic number/strings описывать в аргументах, делая по дефолту значение

// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Компонент это стрелочная функция

type PageTransitionPropsType = {
  isActive: boolean
  onComplete?: VoidFunction
  direction?: 'forward' | 'backward'
}

const onCalculateBarCountHandler = (viewportHeight: number, barHeight = 60) =>
  Math.ceil(viewportHeight / barHeight)

const onGenerateBarsHandler = (
  count: number,
  baseWidth = 80,
  widthVariation = 40,
) =>
  Array.from({ length: count }, () => {
    const variation = (Math.random() - 0.5) * widthVariation

    return baseWidth + variation
  })

const onCalculateTransitionDurationHandler = (
  count: number,
  baseDuration = 800,
  countMultiplier = 50,
) => baseDuration + count * countMultiplier

const onGetAnimationTimelineHandler = (
  direction: 'forward' | 'backward',
  index: number,
  duration = 0.8,
  delayStep = 0.05,
  easing = 'cubic-bezier(0.65, 0, 0.35, 1)',
) => {
  const animationName = direction === 'forward' ? 'slideRight' : 'slideLeft'
  const delay = index * delayStep

  return `${animationName} ${duration}s ${easing} ${delay}s forwards`
}

const onGetBarStylesHandler = (
  direction: 'forward' | 'backward',
  index: number,
  width: number,
  barHeight = 60,
) => ({
  top: `${index * barHeight}px`,
  height: `${barHeight}px`,
  width: `${width}%`,
  animation: onGetAnimationTimelineHandler(direction, index),
  opacity: 0,
  willChange: 'transform, opacity',
})

export const PageTransition: FC<PageTransitionPropsType> = ({
  isActive,
  onComplete,
  direction = 'forward',
}) => {
  const [bars, setBars] = useState<number[]>([])
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!isActive) {
      setBars([])

      return undefined
    }

    const viewportHeight = window.innerHeight
    const count = onCalculateBarCountHandler(viewportHeight)

    startTransition(() => {
      setBars(onGenerateBarsHandler(count))
    })

    if (!onComplete) {
      return undefined
    }

    const duration = onCalculateTransitionDurationHandler(count)
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        onComplete()
      })
    }, duration)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isActive, onComplete, startTransition])

  if (!isActive) {
    return null
  }

  return (
    <div className={clsx('fixed inset-0 z-[9999] pointer-events-none')}>
      <ArrayRender
        items={bars}
        renderItem={(width, index) => (
          <div
            key={index}
            className={clsx('absolute left-0 bg-black')}
            style={onGetBarStylesHandler(direction, index, width)}
          />
        )}
      />
    </div>
  )
}
