export const enum RoutesEnum {
  HOME = '/',
  COURSES = '/a',
  COURSE = '/c',
  PREVIEW = '/p',
  DRAFTS = '/d',
  ADMIN_DASHBOARD = '/admin-dashboard',
  LOGIN = '/login',
}

export const enum QueryParametersEnum {
  PAGE = 'page',
  PAGE_SIZE = 'pageSize',
  REFRESH_TOKEN = 'refresh_token',
  ACCESS_TOKEN = 'access_token',
  IS_SOCKET_MODAL_OPEN = 'is_socket_modal_open',
  IS_BLOCK_MODAL_OPEN = 'is_block_modal_open',
  SELECTED_MODULE_ID = 'selected_module_id',
  SELECTED_SOCKET_ID = 'selected_socket_id',
}
export const enum QueryParametersValuesEnum {}

export type RouterType = Record<
  QueryParametersEnum,
  string | number | boolean | null | undefined | string[] | number[] | boolean[]
>
