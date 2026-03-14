interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

interface TelegramWebApp {
  version: string
  platform: string
  initDataUnsafe?: {
    user?: TelegramUser
  }
  ready: () => void
  expand: () => void
  sendData: (data: string) => void
  onEvent: (eventType: 'mainButtonClicked', eventHandler: () => void) => void
  offEvent: (eventType: 'mainButtonClicked', eventHandler: () => void) => void
  MainButton: {
    show: () => void
    hide: () => void
    setParams: (params: {
      text?: string
      color?: string
      text_color?: string
      is_visible?: boolean
    }) => void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export {}
