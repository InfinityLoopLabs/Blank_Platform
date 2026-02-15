import { ReactNode } from 'react'

export type NotifyType = {
  title: string
  status: 'positive' | 'warning' | 'negative' | 'info'
  width?: number
  height?: number
  ActionButton?: ReactNode
  details?: string[]
}
