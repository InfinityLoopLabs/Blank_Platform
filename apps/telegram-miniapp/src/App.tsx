import { useEffect, useMemo, useState } from 'react'
import { getTelegramWebApp } from './lib/telegram'

function App() {
  const webApp = useMemo(() => getTelegramWebApp(), [])
  const [mainButtonVisible, setMainButtonVisible] = useState(false)

  useEffect(() => {
    if (!webApp) {
      return
    }

    webApp.ready()
    webApp.expand()

    webApp.MainButton.setParams({
      text: 'Send Data To Bot',
      color: '#0ea5e9',
      text_color: '#ffffff',
      is_visible: false,
    })

    const handleMainButtonClick = () => {
      webApp.sendData(
        JSON.stringify({
          action: 'main_button_clicked',
          createdAt: new Date().toISOString(),
        }),
      )
    }

    webApp.onEvent('mainButtonClicked', handleMainButtonClick)

    return () => {
      webApp.offEvent('mainButtonClicked', handleMainButtonClick)
    }
  }, [webApp])

  const toggleMainButton = () => {
    if (!webApp) {
      return
    }

    if (mainButtonVisible) {
      webApp.MainButton.hide()
      setMainButtonVisible(false)
      return
    }

    webApp.MainButton.show()
    setMainButtonVisible(true)
  }

  const user = webApp?.initDataUnsafe?.user

  return (
    <main className="layout">
      <section className="card">
        <p className="badge">Telegram Mini App</p>
        <h1>React app is ready for Telegram</h1>
        <p className="description">
          This app works both in browser and inside Telegram WebApp container.
        </p>

        <dl className="meta">
          <div>
            <dt>Runtime</dt>
            <dd>{webApp ? 'Telegram WebApp' : 'Regular browser'}</dd>
          </div>
          <div>
            <dt>User</dt>
            <dd>{user ? `${user.first_name} ${user.last_name ?? ''}`.trim() : 'Unknown'}</dd>
          </div>
          <div>
            <dt>Version</dt>
            <dd>{webApp?.version ?? 'N/A'}</dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>{webApp?.platform ?? 'web'}</dd>
          </div>
        </dl>

        <button type="button" onClick={toggleMainButton} className="action-btn">
          {mainButtonVisible ? 'Hide' : 'Show'} Telegram Main Button
        </button>
      </section>
    </main>
  )
}

export default App
