import * as React from 'react'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'

export type BreadcrumbsItemObjectType = {
  key?: React.Key
  label?: React.ReactNode
  href?: string
  onClick?: React.ComponentProps<'a'>['onClick']
  isCurrent?: boolean
  component?: React.ReactElement
}

export type BreadcrumbsItemType = BreadcrumbsItemObjectType | React.ReactElement

type BreadcrumbsPropertyType = React.ComponentProps<'nav'> & {
  items: BreadcrumbsItemType[]
  maxItems?: number
  separator?: React.ReactNode
  listClassName?: string
}

type BreadcrumbsViewItemType =
  | {
      kind: 'item'
      item: BreadcrumbsItemType
      originalIndex: number
    }
  | {
      kind: 'ellipsis'
    }

const getElementChildren = (item: React.ReactElement) => {
  const itemProperty = item.props as {
    children?: React.ReactNode
  }

  return itemProperty.children
}

const withChildren = (item: React.ReactElement, children: React.ReactNode) =>
  React.cloneElement(item, undefined, children)

export const Breadcrumbs = ({
  items,
  maxItems,
  separator,
  listClassName,
  ...props
}: BreadcrumbsPropertyType) => {
  const viewItems = React.useMemo<BreadcrumbsViewItemType[]>(() => {
    if (
      !Number.isFinite(maxItems) ||
      !maxItems ||
      maxItems < 2 ||
      items.length <= maxItems
    ) {
      return items.map((item, index) => ({
        kind: 'item',
        item,
        originalIndex: index,
      }))
    }

    const tailCount = maxItems - 1
    const tailStartIndex = items.length - tailCount
    const tailItems = items.slice(tailStartIndex).map((item, index) => ({
      kind: 'item' as const,
      item,
      originalIndex: tailStartIndex + index,
    }))

    return [
      {
        kind: 'item',
        item: items[0],
        originalIndex: 0,
      },
      {
        kind: 'ellipsis',
      },
      ...tailItems,
    ]
  }, [items, maxItems])

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList className={listClassName}>
        {viewItems.map((viewItem, index) => {
          const isLastViewItem = index === viewItems.length - 1

          if (viewItem.kind === 'ellipsis') {
            return (
              <React.Fragment key="ellipsis">
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                {!isLastViewItem ? (
                  <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                ) : null}
              </React.Fragment>
            )
          }

          const { item, originalIndex } = viewItem

          if (React.isValidElement(item)) {
            const isPage = isLastViewItem
            const label = getElementChildren(item)

            return (
              <React.Fragment key={item.key ?? originalIndex}>
                <BreadcrumbItem>
                  {isPage ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>{item}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLastViewItem ? (
                  <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                ) : null}
              </React.Fragment>
            )
          }

          const { key, label, href, onClick, isCurrent, component } = item
          const isPage = isCurrent ?? isLastViewItem
          const componentLabel = component
            ? getElementChildren(component)
            : undefined
          const pageLabel = label ?? componentLabel

          return (
            <React.Fragment key={key ?? originalIndex}>
              <BreadcrumbItem>
                {isPage ? (
                  <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
                ) : component ? (
                  <BreadcrumbLink asChild>
                    {label !== undefined
                      ? withChildren(component, label)
                      : component}
                  </BreadcrumbLink>
                ) : href ? (
                  <BreadcrumbLink href={href} onClick={onClick}>
                    {label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLastViewItem ? (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              ) : null}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
