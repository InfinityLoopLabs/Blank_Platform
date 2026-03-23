import { useEffect } from 'react'
import { useIndexeddbActions } from '../hooks/useIndexeddbActions'

type IndexedDbInstanceType = {
  createObjectStore: (
    tableNames: string[],
    version?: number,
  ) => Promise<boolean | unknown>
}

export type IndexedDbConfigType = {
  instance: IndexedDbInstanceType
  tableNames: string[]
  version?: number
}

export const useContainer = (
  indexedDbInstances: IndexedDbConfigType[] = [],
) => {
  const { setIsIndexedDBInitialized } = useIndexeddbActions()

  useEffect(() => {
    if (!indexedDbInstances.length) {
      setIsIndexedDBInitialized(false)

      return
    }

    let isActive = true

    const initIndexedDB = async () => {
      const results = await Promise.all(
        indexedDbInstances.map(async ({ instance, tableNames, version }) => {
          try {
            return await instance.createObjectStore(tableNames, version)
          } catch {
            return false
          }
        }),
      )

      if (isActive) {
        setIsIndexedDBInitialized(results.every(Boolean))
      }
    }

    initIndexedDB().catch(() => {
      if (isActive) {
        setIsIndexedDBInitialized(false)
      }
    })

    return () => {
      isActive = false
    }
  }, [setIsIndexedDBInitialized])
}
