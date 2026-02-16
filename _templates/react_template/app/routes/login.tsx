import { Page as PageComponent } from '@pages/Login'
import type { Route } from './+types/login'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login' },
    {
      name: 'description',
      content: 'Authenticate to Infinityloop',
    },
  ]
}

export default function Page() {
  return <PageComponent />
}
