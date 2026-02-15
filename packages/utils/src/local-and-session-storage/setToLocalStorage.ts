/**
 * The setToLocalStorage function takes in a key and data as arguments.
 * It then sets the item to local storage with the given key and stringified data.
 *
 * @example setToLocalStorage<UserDateType>('user', { id })
 *
 * @param key string Identify the data in localstorage
 * @param data T Tell the function what type of data it will be receiving
 *
 * @return Void
 *
 */

export const setToLocalStorage = <T>(key: string, data: T) => {
  const encodedData = btoa(JSON.stringify(data))
  localStorage.setItem(key, encodedData)
}
