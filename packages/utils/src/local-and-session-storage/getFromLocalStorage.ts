/**
 * The getFromLocalStorage function retrieves a value from localStorage.
 * @example const data = getFromLocalStorage<UserDataType>('user')
 * @param key string Specify the key of the item in local storage
 *
 * @return The parsed item from local storage
 *
 */
export const getFromLocalStorage = <T>(key: string) => {
  const localStorageItem = localStorage.getItem(key)

  if (localStorageItem) {
    const decodedItem = atob(localStorageItem)

    return JSON.parse(decodedItem) as T
  }

  return null
}
