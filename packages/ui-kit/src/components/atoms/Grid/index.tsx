import { forwardRef, HTMLAttributes } from 'react'
import { clsx } from '@infinityloop.labs/utils'

type OwnPropertyType = {
  column?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
} & HTMLAttributes<HTMLDivElement>

// В продакшене будет отключен jit компилятор, поэтому может не подхватиться сгенерированная через reduce версия
const gridCols = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  '7': 'grid-cols-7',
  '8': 'grid-cols-8',
  '9': 'grid-cols-9',
  '10': 'grid-cols-10',
  '11': 'grid-cols-11',
  '12': 'grid-cols-12',
}

export const Grid = forwardRef<HTMLDivElement, OwnPropertyType>(
  ({ children, className = '', column = 2, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('grid', gridCols[column], className)}
      {...props}>
      {children}
    </div>
  )
)

Grid.displayName = 'Grid'
