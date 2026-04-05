import { enhancedApi as auth } from '@generated/hooks/auth'
import { enhancedApi as drafts } from '@generated/hooks/drafts'

const generatedMiddlewaresList = [auth.middleware, drafts.middleware]

// Этот файл нужен для автоматической инъекции middlewares в ваш store
export { generatedMiddlewaresList }
