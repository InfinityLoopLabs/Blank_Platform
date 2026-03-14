export function getTelegramWebApp() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.Telegram?.WebApp ?? null
}
