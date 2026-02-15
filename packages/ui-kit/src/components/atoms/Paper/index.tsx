import { clsx } from '@infinityloop.labs/utils'
import { Flex } from '../Flex'

export type PaperPropertyType = {
  className?: string
  color?: 'white' | 'gray'
}

export const Paper: FC<PaperPropertyType> = ({
  children,
  className,
  color = 'white',
}) => (
  <Flex
    className={clsx(
      'rounded-3',
      {
        'bg-content-constant': color === 'white',
        'bg-content-secondary': color === 'gray',
      },
      className,
    )}>
    {children}
  </Flex>
)
