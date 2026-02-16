import type { FC, ReactNode } from 'react'
import { clsx } from '@infinityloop.labs/utils'

type TypographyVariantType = 'h1' | 'sub_h1' | 'h2'

type TypographyPropertyType = {
  variant: TypographyVariantType
  children: ReactNode
  className?: Nullable<string>
}

const variantClassNameDictionary: Record<TypographyVariantType, string> = {
  h1: 'text-4xl font-bold mb-2 text-white',
  sub_h1: 'text-neutral-400',
  h2: 'text-xs font-mono',
}

const variantTagDictionary: Record<TypographyVariantType, string> = {
  h1: 'h1',
  sub_h1: 'p',
  h2: 'h2',
}

export const Typography: FC<TypographyPropertyType> = ({
  variant,
  children,
  className,
}) => {
  const Tag = variantTagDictionary[variant]

  return (
    <Tag className={clsx(variantClassNameDictionary[variant], className)}>
      {children}
    </Tag>
  )
}
