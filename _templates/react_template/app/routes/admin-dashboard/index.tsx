import { Page as PageComponent } from '@pages/AdminDashboard'
import type { Route } from './+types/byId'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    {
      name: 'description',
      content: 'Welcome to React Router!',
    },
  ]
}

export default function Page() {
  return <PageComponent />
}
