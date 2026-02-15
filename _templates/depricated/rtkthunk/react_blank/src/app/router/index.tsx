import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { NotFound } from '@components/templates/404'
import { RoutesEnum } from '@constants/routes'
import { Layouts } from '@layouts/index'

const Simple = lazy(() =>
  import('@pages/Simple').then(module => ({
    default: module.Page,
  }))
)

export const AppRouter: FC = () => (
  <Routes>
    <Route path={RoutesEnum.main} element={<Layouts.Main />}>
      <Route index element={<Simple />} />
    </Route>

    {/* <Route path={RoutesEnum.admin} element={<Layouts.Secondary />}>*/}
    {/*  <Route index element={<div>1</div>} />*/}
    {/*  <Route path={Constants.routes.banned} element={<div>2</div>} />*/}
    {/* </Route>*/}

    <Route path="*" element={<NotFound />} />
  </Routes>
)
