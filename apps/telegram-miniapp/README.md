# app_telegram

React-based Telegram Mini App workspace.

## Scripts

- `npm run --workspace app_telegram dev` - start local development server on port `4070`
- `npm run --workspace app_telegram build` - production build
- `npm run --workspace app_telegram preview` - preview production build

## Telegram integration

1. Deploy this app and get HTTPS URL.
2. In your bot setup (`/newapp` in [@BotFather](https://t.me/BotFather)), set that URL as Mini App URL.
3. Open Mini App from Telegram bot menu/button.

When user clicks Telegram Main Button, the app sends JSON payload through `WebApp.sendData(...)`.
