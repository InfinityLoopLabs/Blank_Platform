import { ReactNode } from 'react'

export type PopupType = {
  id: string
  title?: string | ReactNode
  description?: string
  canClose?: boolean
  JSX?: ReactNode
  status?: 'positive' | 'warning' | 'negative' | 'info'
  paperClassName?: string
}
