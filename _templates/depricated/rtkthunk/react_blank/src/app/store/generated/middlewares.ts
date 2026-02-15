import { orderStore } from '@generated/hooks/order'
import { petStore } from '@generated/hooks/pet'
import { userStore } from '@generated/hooks/user'

const generatedMiddlewaresList = [
  orderStore.middleware,
  petStore.middleware,
  userStore.middleware,
]

// Этот файл нужен для автоматической инъекции middlewares в ваш store
export { generatedMiddlewaresList }
