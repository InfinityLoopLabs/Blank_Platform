import type { HTMLAttributes } from 'react'

import { clsx } from '@infinityloop.labs/utils'

import { Button, Flex, Input, Paper } from '@/components/atoms'

type FirstDecisionPropertyType = HTMLAttributes<HTMLDivElement> & {
  cancelText?: string
  acceptText?: string
}

export const FirstDecision = ({
  className,
  cancelText = 'Cancel',
  acceptText = 'Accept',
  ...property
}: FirstDecisionPropertyType) => (
  <Paper
    type="dark"
    className={clsx('w-full max-w-2xl p-6', className)}
    {...property}>
    <Flex column className="w-full gap-4">
      <Input label="First name" placeholder="Type first name" />
      <Input label="Email" type="email" placeholder="Type email" />
      <Input
        label="Comment"
        isTextarea
        textareaRowsCount={4}
        placeholder="Type your comment"
      />

      <Flex className="w-full gap-3" justify-content="flex-end">
        <Button color="secondary">{cancelText}</Button>
        <Button color="constructive" animation="active">
          {acceptText}
        </Button>
      </Flex>
    </Flex>
  </Paper>
)
