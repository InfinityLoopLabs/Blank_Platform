import { Provider } from 'react-redux'
import { store } from '@app/store/store'

export const ReduxStoreProvider: FC = ({ children }) => (
  <Provider store={store}>{children}</Provider>
)
