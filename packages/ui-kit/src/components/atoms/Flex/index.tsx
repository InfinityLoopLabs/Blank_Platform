import { forwardRef, HTMLAttributes } from 'react'
import { clsx } from '@infinityloop.labs/utils'
import type { JustifyContentType, AlignItemsType } from './lib/types'
import { alignItems, justifyContent } from './lib/types'

type OwnPropertyType = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  column?: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middle?: boolean
  'justify-content'?: JustifyContentType
  'align-items'?: AlignItemsType
} & HTMLAttributes<HTMLDivElement>

export const Flex = forwardRef<HTMLDivElement, OwnPropertyType>(
  ({ children, className = '', column, middle, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex',
        column && 'flex-col',
        props['justify-content'] && justifyContent[props['justify-content']],
        props['align-items'] && alignItems[props['align-items']],
        middle && `${alignItems.center} ${justifyContent.center}`,
        className,
      )}
      {...props}>
      {children}
    </div>
  ),
)

Flex.displayName = 'Flex'
