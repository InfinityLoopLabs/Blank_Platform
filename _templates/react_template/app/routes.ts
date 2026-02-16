import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { RoutesEnum } from './constants/routes'

export default [
  index('routes/home.tsx'),
  route(RoutesEnum.LOGIN, 'routes/login.tsx'),

  route(RoutesEnum.COURSES, 'routes/courses/list.tsx'),
  route(`${RoutesEnum.COURSE}/:id`, 'routes/courses/byId.tsx'),

  route(`${RoutesEnum.PREVIEW}/:id`, 'routes/preview/preview.tsx'),

  route(`${RoutesEnum.DRAFTS}/:id`, 'routes/drafts/byId.tsx'),

  route(`${RoutesEnum.ADMIN_DASHBOARD}/`, 'routes/admin-dashboard/index.tsx'),
] satisfies RouteConfig
