import React from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'
import { LoginForm } from '@widgets/LoginForm'

export const Page: FC = ({}) => (
  <Flex className={clsx('size-full h-screen')}>
    <LoginForm.Widget />
  </Flex>
)
