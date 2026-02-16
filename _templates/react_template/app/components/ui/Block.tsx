import React from 'react'
import { clsx } from 'clsx'

type OwnPropertyType = {
  letter: Nullable<string>
  title: string
  className?: Nullable<string>
}

export const Block: FC<OwnPropertyType> = ({
  letter,
  title,
  className,
  children,
}) => (
  <div className={clsx('relative mb-20', className)}>
    <div className="absolute top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-transparent" />
    <div className="flex items-center gap-4 mb-6 pl-4">
      {letter && (
        <span className="text-6xl font-bold text-orange-500">{letter}</span>
      )}
      <h2 className="text-2xl font-bold tracking-wider text-white uppercase">
        {title}
      </h2>
    </div>
    <div className="pl-8">{children}</div>
  </div>
)
