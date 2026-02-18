import { type ReactNode } from 'react'
import {
  appSize,
  indexeddb,
  popup,
  router,
} from '@infinityloop.labs/fronted-core'
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
import { analyticsEngine } from '@services/analyticsEngine'
import { auth } from '@services/auth'
import { theme } from '@services/theme'
import { Popup } from '@widgets/Popup'
import {
  indexedDBInstance,
  indexedDbTableNames,
  indexedDbVersion,
} from '@application/api/indexeddb'
import { Providers } from '@application/providers'
import type { Route } from './+types/root'

import './app.css'

const indexedDbInstances = [
  {
    instance: indexedDBInstance,
    tableNames: indexedDbTableNames,
    version: indexedDbVersion,
  },
]

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
  return (
    <Flex className="size-full bg-black" column>
      <Flex>
        <Flex className="overflow-y-auto w-full">
          <Outlet />
        </Flex>
      </Flex>

      <Popup.Widget />

      {/*  Сервисы без авторизации: Начало */}
      <ServiceInjector
        services={[
          analyticsEngine.service,
          appSize.service,
          auth.service,
          indexeddb.service(indexedDbInstances),
          popup.service,
          router.service,
          theme.service,
        ]}
      />
      {/*  Сервисы без авторизации: Конец */}

      {/*  Сервисы с авторизацией: Начало */}
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
