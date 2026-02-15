import React from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'
import { dti } from '../constants/data-testid'

export const dtiDictionary = {
  mainDiv: 'UI',
}

export type UIPropertyType = {
  t: Callback<string, string>
}

export const UI: FC<UIPropertyType> = React.memo(({ t }) => (
  <Flex data-testid={`${dti}${dtiDictionary.mainDiv}`} className={clsx('')}>
    {t('text')}
  </Flex>
))
