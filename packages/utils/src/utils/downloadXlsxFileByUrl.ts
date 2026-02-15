import { base64ToArrayBuffer } from './base64ToArrayBuffer.ts'

/**
 * Downloads an XLSX file using base64 data
 * @param {string | Blob}  data - Base64 encoded file data
 * @param {string} fileName - Name for the downloaded file (without extension)
 * @returns {void}
 * @example
 * ```ts
 * downloadXlsxFileByUrl('base64String...', 'report') // Downloads 'report.xlsx'
 * ```
 */
export const downloadXlsxFileByUrl = (
  data: string | Blob,
  fileName: string
) => {
  if (!data) {
    return
  }

  const byteArray = base64ToArrayBuffer(data as string)

  const blob = new Blob([byteArray as never], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // лучше .xlsx
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${fileName}.xlsx`
  link.target = '_blank'

  document.body.appendChild(link)
  link.click()

  URL.revokeObjectURL(link.href)
  document.body.removeChild(link)
}
