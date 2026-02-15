import { Flex } from '@npm.piece/ui-kit'
import React from 'react'

type OwnPropertyType = {}

export const Sample: FC<OwnPropertyType> = React.memo(({}) => {
  const sample = 'Sample'

  return <Flex>{sample}</Flex>
})
