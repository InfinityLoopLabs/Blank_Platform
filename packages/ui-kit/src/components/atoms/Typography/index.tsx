import React, { FC, AnchorHTMLAttributes } from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type TypographyType =
  /*  */
  | 'H1SemiBold' // 24 / 140% / 600
  | 'H2SemiBold' // 20 / 140% / 600
  | 'H3Medium' // 18 / 148% / 500
  | 'H3SemiBold' // 18 / 148% / 600
  | 'H4SemiBold' // 16 / 148% / 600
  | 'MRegular' // 16 / 148% / 400
  | 'MMedium' // 16 / 148% / 500
  | 'MSemiBold' // 16 / 148% / 600
  | 'SRegular' // 14 / 148% / 400
  | 'SMedium' // 14 / 148% / 500
  | 'SSemiBold' // 14 / 148% / 600
  | 'XSMedium' // 12 / 130% / 500
  | 'MonoMRegular' // mono 16 / 140% / 400
  | 'MonoSRegular' // mono 14 / 140% / 400
  /*  */
  | 'Heading32'
  | 'Heading24'
  | 'Heading20'
  | 'Heading16'
  | 'Heading14'
  | 'Heading12'
  | 'SemiBold52'
  | 'SemiBold48'
  | 'SemiBold40'
  | 'SemiBold32'
  | 'SemiBold24'
  | 'SemiBold20'
  | 'SemiBold16'
  | 'SemiBold14'
  | 'Regular24'
  | 'Regular20'
  | 'Regular16'
  | 'Regular14'
  | 'Regular12'
  | 'Mono16'

type ElementType =
  | 'a'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'

/* Карта классов: Начало */
const typographyToTailwindClass: Record<TypographyType, string> = {
  /*  */
  H1SemiBold: 'text-24 leading-140 font-600',
  H2SemiBold: 'text-20 leading-140 font-600',
  H3Medium: 'text-18 leading-148 font-500',
  H3SemiBold: 'text-18 leading-148 font-600',
  H4SemiBold: 'text-16 leading-148 font-600',

  MRegular: 'text-16 leading-148 font-400',
  MMedium: 'text-16 leading-148 font-500',
  MSemiBold: 'text-16 leading-148 font-600',

  SRegular: 'text-14 leading-148 font-400',
  SMedium: 'text-14 leading-148 font-500',
  SSemiBold: 'text-14 leading-148 font-600',

  XSMedium: 'text-12 leading-130 font-500',

  MonoMRegular: 'font-mono text-16 leading-140 font-400',
  MonoSRegular: 'font-mono text-14 leading-140 font-400',

  /*  */
  Heading32: 'text-32 leading-40 font-600',
  Heading24: 'text-24 leading-30 font-600',
  Heading20: 'text-20 leading-28 font-600',
  Heading16: 'text-16 leading-24 font-600',
  Heading14: 'text-14 leading-16 font-600',
  Heading12: 'text-12 leading-16 font-600',

  SemiBold52: 'text-52 leading-64 font-600',
  SemiBold48: 'text-48 leading-60 font-600',
  SemiBold40: 'text-40 leading-48 font-600',
  SemiBold32: 'text-32 leading-40 font-600',
  SemiBold24: 'text-24 leading-32 font-600',
  SemiBold20: 'text-20 leading-28 font-600',
  SemiBold16: 'text-16 leading-24 font-600',
  SemiBold14: 'text-14 leading-20 font-600',

  Regular24: 'text-24 leading-30 font-400',
  Regular20: 'text-20 leading-26 font-400',
  Regular16: 'text-16 leading-24 font-400',
  Regular14: 'text-14 leading-20 font-400',
  Regular12: 'text-12 leading-16 font-400',

  Mono16: 'font-mono text-16 leading-24 font-400',
}
/* Карта классов: Конец */

type OwnPropertyType = {
  typography: TypographyType
  element?: ElementType
  className?: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

export const Typography: FC<OwnPropertyType> = ({
  typography,
  element = 'span',
  className: clsname = '',
  children,
  ...props
}) => {
  const className = clsx(
    'font-infinityloop',
    typographyToTailwindClass[typography],
    clsname,
  )

  return React.createElement(
    element,
    {
      className,
      ...props,
    },
    children,
  )
}

Typography.displayName = 'Typography'
