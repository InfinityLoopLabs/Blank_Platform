import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loading } from '@components/templates/Loading'

export const Secondary: FC = () => (
  <div className="flex min-h-screen flex-col">
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  </div>
)
