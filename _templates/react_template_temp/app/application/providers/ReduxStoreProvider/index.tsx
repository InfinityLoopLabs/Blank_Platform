import { store } from '@application/store/store'
import { Provider } from 'react-redux'

export const ReduxStoreProvider: FC = ({ children }) => (
  <Provider store={store}>{children}</Provider>
)
