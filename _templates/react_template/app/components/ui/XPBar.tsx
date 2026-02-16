'use client'

import { useEffect, useState } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { ArrowBigUpDash } from 'lucide-react'

/* Утилита расчёта уровня: Начало */
// Формула: на 1-й уровень нужно 200 XP, затем +100 за каждый следующий
const getLevelByXP = (rawXp: number) => {
  const xp = Math.max(0, Math.floor(Number(rawXp) || 0))

  let level = 1
  let required = 200
  let total = 0

  while (xp >= total + required) {
    total += required
    level++
    required += 100
  }

  return {
    level,
    total,
    required,
    xp,
  }
}
/* Утилита расчёта уровня: Конец */

type OwnPropertyType = {
  totalXP: Nullable<number>
}

export const XPBar: FC<OwnPropertyType> = ({ totalXP }) => {
  /* Состояние: Начало */
  const { level, total, required, xp } = getLevelByXP(totalXP || 0)
  const [isShowXPGain, setIsShowXPGain] = useState(false)
  const [isShowLevelUp, setIsShowLevelUp] = useState(false)
  const [previousXP, setPreviousXP] = useState(getLevelByXP(totalXP || 0).xp)
  const [isLevelHovered, setIsLevelHovered] = useState<boolean>(false)
  const xpTextSizeClass = required > 9999 ? 'text-[10px]' : 'text-xs'
  /* Состояние: Конец */

  /* Производные значения прогресса: Начало */
  const xpInCurrentLevel = xp - total
  const xpProgress = required > 0 ? (xpInCurrentLevel / required) * 100 : 0
  /* Производные значения прогресса: Конец */

  /* Трекинг прироста/апа: Начало */
  useEffect(() => {
    const prev = getLevelByXP(previousXP).level
    const curr = level

    if (xp > previousXP) {
      if (curr > prev) {
        setIsShowLevelUp(true)
      } else {
        setIsShowXPGain(true)
      }
    }

    setPreviousXP(xp)
  }, [totalXP])
  /* Трекинг прироста/апа: Конец */

  /* Разметка: Начало */
  return (
    <>
      {/* Контейнер полосы XP: Начало */}
      <Flex column middle>
        {/* Полоса прогресса: Начало */}
        <Flex
          onMouseLeave={() => {
            setIsLevelHovered(false)
            setIsShowLevelUp(false)
          }}
          onMouseEnter={() => {
            setIsLevelHovered(true)
          }}
          className="relative h-1 w-8 rounded-full overflow-hidden">
          {/* Основная заливка */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-(--neon-main-dim) to-(--neon-main) shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
            style={{
              width: `${xpProgress}%`,
              transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          {/* Эффект блика */}

          {/* Текст XP */}
        </Flex>
        {/* Полоса прогресса: Конец */}
      </Flex>
      {/* Контейнер полосы XP: Конец */}
    </>
  )
  /* Разметка: Конец */
}
