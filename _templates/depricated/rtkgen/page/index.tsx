import { Flex } from '@npm.piece/ui-kit'
import { clsx } from '@npm.piece/utils'
import { dti } from './constants/data-testid'

export const Page: FC = () => (
  <Flex data-testid={`${dti}Page`} column className={clsx('w-full')}>
    {/*/ Paste widgets here /*/}
  </Flex>
)
