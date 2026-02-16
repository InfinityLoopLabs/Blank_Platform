import type { ReactNode } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { ServiceInjector } from '@infinityloop.labs/utils'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { useAppSelector } from '@hooks/useAppSelector'
import { analyticsEngine } from '@services/analyticsEngine'
import { appSize } from '@services/appSize'
import { auth } from '@services/auth'
import { chartPopover } from '@services/chartPopover'
import { palette } from '@services/palette'
import { router } from '@services/router'
import { theme } from '@services/theme'
import { toolbar } from '@services/toolbar'
import { ActionToolbar } from '@widgets/ActionToolbar'
import { ChartPopover } from '@widgets/ChartPopover'
import { DraftsToolBarBlocks } from '@widgets/DraftsToolBarBlocks'
import { DraftsToolBarEditBlocks } from '@widgets/DraftsToolBarEditBlocks'
import { Header } from '@widgets/Header'
import { Popup } from '@widgets/Popup'
import { Providers } from '@application/providers'
import type { Route } from './+types/root'

import './app.css'

export const links: Route.LinksFunction = () => [
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-full  h-full bg-black">
        <Providers>{children}</Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { isAuthenticated } = useAppSelector(state => state.auth)

  return (
    <Flex className="size-full bg-black" column>
      <Header.Widget />
      {/* График в header: Начало */}
      <ChartPopover.Widget />
      {/* График в header: Конец */}
      <Flex>
        <Flex className="overflow-y-auto w-full">
          <Outlet />
        </Flex>
      </Flex>

      <Popup.Widget />

      <DraftsToolBarBlocks.Widget />

      <DraftsToolBarEditBlocks.Widget />

      <ActionToolbar.Widget />
      {/*  Сервисы без авторизации: Начало */}
      <ServiceInjector
        services={[
          analyticsEngine.service,
          appSize.service,
          palette.service,
          auth.service,
          router.service,
          theme.service,
          toolbar.service,
        ]}
      />
      {/*  Сервисы без авторизации: Конец */}

      {/*  Сервисы с авторизацией: Начало */}
      {isAuthenticated && <ServiceInjector services={[chartPopover.service]} />}
      {/*  Сервисы с авторизацией: Конец */}
    </Flex>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
