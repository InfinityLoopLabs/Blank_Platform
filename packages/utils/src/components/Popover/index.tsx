import { FC, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Компонент Popover
 *
 * @description Создает портал для рендеринга дочерних элементов вне текущего DOM-дерева.
 *
 * @param {Object} props - Свойства компонента
 * @param {ReactNode} props.children - Дочерние элементы, которые будут отрендерены в портале
 *
 * @returns {ReactPortal} Портал с дочерними элементами
 */
export const Popover: FC<{ children: ReactNode }> = ({ children }) => {
  const [container] = useState(() => document.createElement('div'))
  useEffect(() => {
    document.body.appendChild(container)

    return () => {
      document.body.removeChild(container)
    }
  }, [])

  return createPortal(children as any, container)
}
