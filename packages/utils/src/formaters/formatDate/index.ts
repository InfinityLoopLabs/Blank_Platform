import { format, parse } from 'date-fns'

export const formatDate = (value?: string | Date) => {
  if (value) {
    return format(new Date(value), 'dd-MM-yyyy')
  }

  return '-'
}

export const parseDate = (dateString: string) =>
  parse(dateString, 'dd-MM-yyyy', new Date())
