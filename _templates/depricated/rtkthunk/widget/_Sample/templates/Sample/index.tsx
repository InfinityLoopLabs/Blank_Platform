import { Flex } from '@npm.piece/ui-kit'
import { clsx } from '@npm.piece/utils'
import React from 'react'
import { dti } from '../../constants/data-testid'

export const dtiDictionary = {
  mainDiv: 'sample',
}

type OwnPropertyType = {}

export const Simple: FC<OwnPropertyType> = React.memo(({}) => (
  <Flex data-testid={`${dti}${dtiDictionary.mainDiv}`} className={clsx('')}>
    {}
  </Flex>
))
