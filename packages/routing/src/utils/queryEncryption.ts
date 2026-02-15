import CryptoJS from 'crypto-js'

const DEFAULT_QUERY_SECRET = 'routing-query-secret'

let querySecretKey = DEFAULT_QUERY_SECRET

/**
 * Allows overriding the secret key used for encrypting/decrypting routing query params.
 */
export const setQueryParamSecret = (secret: string) => {
  if (secret) {
    querySecretKey = secret
  }
}

export const encryptQueryParams = (value: string) =>
  CryptoJS.AES.encrypt(value, querySecretKey).toString()

export const decryptQueryParams = (value: string) => {
  const bytes = CryptoJS.AES.decrypt(value, querySecretKey)

  return bytes.toString(CryptoJS.enc.Utf8)
}
