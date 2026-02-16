import React, {
  type ButtonHTMLAttributes,
  type FC,
  type ReactNode,
} from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type IconCircleButtonPropertyType = {
  icon: ReactNode
  className?: string
  isDisabled?: boolean
  appearance?: 'default' | 'custom'
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'disabled' | 'type'
>

export const IconCircleButton: FC<IconCircleButtonPropertyType> = ({
  icon,
  className,
  isDisabled,
  appearance = 'default',
  ...buttonAttributes
}) => (
  <button
    type="button"
    className={clsx(
      appearance === 'default'
        ? 'rounded-full bg-black/60 p-2 text-white transition-all duration-300 hover:bg-(--card)'
        : 'rounded-full p-2 text-white transition-all duration-300',
      isDisabled && 'opacity-60 pointer-events-none',
      className,
    )}
    disabled={isDisabled}
    {...buttonAttributes}>
    {icon}
  </button>
)
