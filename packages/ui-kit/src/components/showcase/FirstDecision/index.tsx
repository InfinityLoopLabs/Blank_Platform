import type { HTMLAttributes } from 'react'
import { X } from 'lucide-react'

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
      <Flex className="w-full" justify-content="space-between" align-items="center">
        <p className="text-2xl font-semibold tracking-tight">Пополнить счет</p>
        <Button
          size="icon"
          color="accent"
          variant="outline"
          animation="default"
          className="transition-none hover:scale-100 active:scale-100"
          aria-label="Close"
          icon={<X className="size-4" />}
        />
      </Flex>

      <Input
        label="Name"
        placeholder="Type your name"
        defaultValue="John Example"
      />
      <Input
        label="Сумма пополнения"
        type="number"
        required
        min={1}
        step={1}
        placeholder="Введите сумму"
      />
      <Input label="Email" type="email" placeholder="Type email" />
      <Input
        label="Comment"
        isTextarea
        textareaRowsCount={4}
        placeholder="Type your comment"
      />
      <Input
        type="checkbox"
        required
        label="I Agree to the Terms of Service, Privacy Policy, and License Agreement."
      />

      <Flex className="w-full gap-3" justify-content="flex-end">
        <Button color="primary" variant="text">
          {cancelText}
        </Button>
        <Button color="constructive" animation="active">
          {acceptText}
        </Button>
      </Flex>
    </Flex>
  </Paper>
)
