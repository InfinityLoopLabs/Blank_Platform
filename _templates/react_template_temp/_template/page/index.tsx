import { RoutesTitleEnum } from '@y-internal/constants'
import { Flex, PageTitle } from '@y-internal/ui-kit'
import { Helmet } from 'react-helmet'

const pageTitle = RoutesTitleEnum.businessCalendar

export const Page: FC = () => (
  <>
    <Helmet title={pageTitle} />
    <Flex column className="size-full max-h-full">
      <PageTitle pageTitle={pageTitle} />
      {/*/ Paste widgets here /*/}
    </Flex>
  </>
)
