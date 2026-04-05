import { enhancedApi as auth } from '@generated/hooks/auth'
import { enhancedApi as drafts } from '@generated/hooks/drafts'

const generatedReducersList = {
  [auth.reducerPath]: auth.reducer,
  [drafts.reducerPath]: drafts.reducer,
}

// Этот файл нужен для импорта автоматически сгенерированных reducers в ваш store
export { generatedReducersList }
