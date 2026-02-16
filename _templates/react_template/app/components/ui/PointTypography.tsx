import type { FC } from 'react'
import { clsx } from '@infinityloop.labs/utils'

type OwnPropertyType = {
  label: string
  className?: Nullable<string>
  isShowPulse?: boolean
}

export const PointTypography: FC<OwnPropertyType> = ({
  label,
  className,
  isShowPulse = true,
}) => (
  <div className={clsx('flex items-center gap-3 mb-4', className)}>
    <div
      className={clsx(
        'w-3 h-3 rounded-full bg-orange-500',
        isShowPulse && 'animate-pulse',
      )}
    />
    <span className="text-orange-500 font-mono tracking-widest uppercase">
      {label}
    </span>
  </div>
)
