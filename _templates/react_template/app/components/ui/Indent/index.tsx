import React from 'react'

type OwnPropertyType = {
  size: 3 | 6
}

export const Indent: FC<OwnPropertyType> = ({ size }) => {
  if (size === 6) {
    return <div className="w-full h-12" />
  }

  if (size === 3) {
    return <div className="w-full h-6" />
  }
}
