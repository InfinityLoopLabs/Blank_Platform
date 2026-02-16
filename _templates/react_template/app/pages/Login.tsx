import React from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'

export const Page: FC = ({}) => (
  <Flex data-testid="Sample-Page" className={clsx('size-full h-screen')}>
    Sample Page
  </Flex>
)
