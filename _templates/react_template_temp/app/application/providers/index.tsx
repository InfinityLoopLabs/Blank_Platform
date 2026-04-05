import { ReduxStoreProvider } from './ReduxStoreProvider'

export const Providers: FC = ({ children }) => (
  <ReduxStoreProvider>{children}</ReduxStoreProvider>
)
