import { createRoot } from 'react-dom/client'
import { App } from '@app/entry'
import { reportWebVitals } from './reportWebVitals'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const container = document.getElementById('root')

const root = createRoot(container as HTMLDivElement)

root.render(<App.Container />)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
