import React from 'react'
import { Flex } from '@npm.piece/ui-kit'
import { clsx } from '@npm.piece/utils'
import { dti } from '../../constants/data-testid'

export const dtiDictionary = {
  mainDiv: 'sample',
}

type OwnPropertyType = {}

export const Sample: FC<OwnPropertyType> = React.memo(({}) => (
  <Flex data-testid={`${dti}${dtiDictionary.mainDiv}`} className={clsx('')}>
    {}
  </Flex>
))
