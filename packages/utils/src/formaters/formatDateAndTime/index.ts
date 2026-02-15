import { format, parse } from 'date-fns'

export const formatDateAndTime = (value?: string | Date) => {
  if (value) {
    return format(new Date(value), 'dd-MM-yyyy HH:mm:ss')
  }

  return '-'
}

export const parseDateAndTime = (value: string) =>
  parse(value, 'dd-MM-yyyy HH:mm:ss', new Date())
