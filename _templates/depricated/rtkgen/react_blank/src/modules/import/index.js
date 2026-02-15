import { ErrorBoundary } from '@npm.piece/utils'

import React, { Suspense, lazy } from 'react'

const RedModuleLazy = lazy(
  async () => await import('RenameImportedModuleHere/AnyNameHere')
)

const RemoteFactory = JSX => (
  <ErrorBoundary errorComponent={<h1>error</h1>}>
    <Suspense fallback="Load">{JSX}</Suspense>
  </ErrorBoundary>
)

export const RedModule = props => RemoteFactory(<RedModuleLazy {...props} />)
