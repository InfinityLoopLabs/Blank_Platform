import { format } from 'date-fns'

export const formatTime = (value?: string | Date) => {
  if (value) {
    return format(new Date(value), "HH:mm:ss'")
  }

  return '-'
}
