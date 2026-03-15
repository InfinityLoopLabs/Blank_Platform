import React from 'react'

import { clsx } from '@infinityloop.labs/utils'
import { Typography } from '@/components/atoms/Typography'

type TimerLabelsType = {
  days: React.ReactNode
  hours: React.ReactNode
  minutes: React.ReactNode
  seconds: React.ReactNode
}

export type TimerPropertyType = {
  targetDate: Date | number | string
  className?: string
  itemClassName?: string
  labels?: Partial<TimerLabelsType>
  onComplete?: () => void
}

type RemainingTimeType = {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

const DEFAULT_LABELS: TimerLabelsType = {
  days: 'дн.',
  hours: 'ч.',
  minutes: 'мин.',
  seconds: 'с.',
}

const SECOND_IN_MS = 1000
const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS
const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS

const resolveTargetTimestamp = (
  targetDate: TimerPropertyType['targetDate'],
): number | null => {
  if (targetDate instanceof Date) {
    const dateTimestamp = targetDate.getTime()

    return Number.isFinite(dateTimestamp) ? dateTimestamp : null
  }

  if (typeof targetDate === 'number') {
    return Number.isFinite(targetDate) ? targetDate : null
  }

  const parsedTimestamp = new Date(targetDate).getTime()

  return Number.isFinite(parsedTimestamp) ? parsedTimestamp : null
}

const getRemainingTime = (
  targetTimestamp: number | null,
  nowTimestamp: number,
): RemainingTimeType => {
  if (targetTimestamp === null) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    }
  }

  const diffInSeconds = Math.max(
    Math.floor((targetTimestamp - nowTimestamp) / SECOND_IN_MS),
    0,
  )
  const days = Math.floor(diffInSeconds / DAY_IN_SECONDS)
  const hours = Math.floor((diffInSeconds % DAY_IN_SECONDS) / HOUR_IN_SECONDS)
  const minutes = Math.floor(
    (diffInSeconds % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS,
  )
  const seconds = diffInSeconds % MINUTE_IN_SECONDS

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: diffInSeconds <= 0,
  }
}

const formatUnitValue = (value: number) => value.toString().padStart(2, '0')

export const Timer = ({
  targetDate,
  className,
  itemClassName,
  labels,
  onComplete,
}: TimerPropertyType) => {
  const targetTimestamp = React.useMemo(
    () => resolveTargetTimestamp(targetDate),
    [targetDate],
  )
  const resolvedLabels = React.useMemo(
    () => ({
      ...DEFAULT_LABELS,
      ...labels,
    }),
    [labels],
  )

  const [remainingTime, setRemainingTime] = React.useState<RemainingTimeType>(
    () => getRemainingTime(targetTimestamp, Date.now()),
  )
  const hasCompletedRef = React.useRef(false)

  React.useEffect(() => {
    setRemainingTime(getRemainingTime(targetTimestamp, Date.now()))
    hasCompletedRef.current = false

    if (targetTimestamp === null) {
      return
    }

    const intervalId = window.setInterval(() => {
      setRemainingTime(getRemainingTime(targetTimestamp, Date.now()))
    }, SECOND_IN_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [targetTimestamp])

  React.useEffect(() => {
    if (targetTimestamp === null || !remainingTime.isComplete) {
      return
    }

    if (hasCompletedRef.current) {
      return
    }

    hasCompletedRef.current = true
    onComplete?.()
  }, [onComplete, remainingTime.isComplete, targetTimestamp])

  const units = [
    {
      key: 'days',
      value: remainingTime.days,
      label: resolvedLabels.days,
    },
    {
      key: 'hours',
      value: remainingTime.hours,
      label: resolvedLabels.hours,
    },
    {
      key: 'minutes',
      value: remainingTime.minutes,
      label: resolvedLabels.minutes,
    },
    {
      key: 'seconds',
      value: remainingTime.seconds,
      label: resolvedLabels.seconds,
    },
  ] as const

  return (
    <div className={clsx('inline-flex items-end gap-2', className)}>
      {units.map((unit, index) => (
        <React.Fragment key={unit.key}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={clsx(
                'min-w-14 rounded-sm border border-(--border) bg-primary px-2 py-1 text-center shadow-xs',
                itemClassName,
              )}>
              <span className="inline-block font-infinityloop text-3xl leading-none font-semibold tabular-nums text-primary-foreground">
                {formatUnitValue(unit.value)}
              </span>
            </div>
            <Typography typography="Caption" className="normal-case">
              {unit.label}
            </Typography>
          </div>
          {index < units.length - 1 ? (
            <span
              aria-hidden
              className="pb-6 font-infinityloop text-2xl leading-none text-muted-foreground">
              :
            </span>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  )
}

Timer.displayName = 'Timer'
