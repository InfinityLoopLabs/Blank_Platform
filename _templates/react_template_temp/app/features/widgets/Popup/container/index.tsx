import { name } from '../constants/'
import { UI } from '../ui'
import { useContainer } from './useContainer'

export const Container: FC = () => <UI {...useContainer()} />

Container.displayName = name
