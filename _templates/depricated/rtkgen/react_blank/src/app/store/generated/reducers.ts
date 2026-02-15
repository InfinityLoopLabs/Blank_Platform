import { orderStore } from '@generated/hooks/order'
import { petStore } from '@generated/hooks/pet'
import { userStore } from '@generated/hooks/user'

const generatedReducersList = {
  [orderStore.reducerPath]: orderStore.reducer,
  [petStore.reducerPath]: petStore.reducer,
  [userStore.reducerPath]: userStore.reducer,
}

// Этот файл нужен для импорта автоматически сгенерированных reducers в ваш store
export { generatedReducersList }
