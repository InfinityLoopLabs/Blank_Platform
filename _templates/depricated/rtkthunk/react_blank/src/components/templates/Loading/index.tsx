import { Flex } from '@npm.piece/ui-kit'
import React from 'react'

type OwnPropertyType = {}

export const Loading: FC<OwnPropertyType> = React.memo(() => {
  const loading = 'Loading'

  return <Flex>{loading}</Flex>
})
