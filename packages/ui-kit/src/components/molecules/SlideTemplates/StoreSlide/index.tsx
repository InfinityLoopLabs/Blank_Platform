import * as React from 'react'

import { Paper } from '@/components/atoms/Paper'
import { getTypographyClassName } from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'
import { cn } from '@/lib/utils'

export type StoreSlideImageChangePayloadType = {
  file: File
  objectUrl: string
}

type StoreSlidePropertyType = Omit<
  React.HTMLAttributes<HTMLElement>,
  'title'
> & {
  isSetModeEnabled?: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  setModelEnabled?: boolean
  coverImageSrc: string
  coverImageAlt?: string
  imageAccept?: string
  onImageChange?: (payload: StoreSlideImageChangePayloadType) => void
  brandName: React.ReactNode
  brandIcon?: React.ReactNode
  heading: React.ReactNode
  accentText?: React.ReactNode
  description?: React.ReactNode
  priceText: React.ReactNode
  tagText?: string
  badgeText?: React.ReactNode
}

const toEditableText = (value: React.ReactNode): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return ''
}

export const StoreSlide = ({
  className,
  isSetModeEnabled = false,
  setModelEnabled,
  coverImageSrc,
  coverImageAlt = 'Slide cover image',
  imageAccept = 'image/*',
  onImageChange,
  brandName,
  brandIcon,
  heading,
  accentText,
  description,
  priceText,
  tagText,
  badgeText,
  ...property
}: StoreSlidePropertyType) => {
  const isSetModeResolvedEnabled = isSetModeEnabled || Boolean(setModelEnabled)
  const resolvedTagText = tagText ?? toEditableText(badgeText)
  const fileInputReference = React.useRef<HTMLInputElement | null>(null)
  const lastObjectUrlReference = React.useRef<string | null>(null)

  const [localCoverImageSrc, setLocalCoverImageSrc] =
    React.useState(coverImageSrc)
  const [localBrandName, setLocalBrandName] = React.useState(() =>
    toEditableText(brandName),
  )
  const [localHeading, setLocalHeading] = React.useState(() =>
    toEditableText(heading),
  )
  const [localAccentText, setLocalAccentText] = React.useState(() =>
    toEditableText(accentText ?? ''),
  )
  const [localDescription, setLocalDescription] = React.useState(() =>
    toEditableText(description ?? ''),
  )
  const [localPriceText, setLocalPriceText] = React.useState(() =>
    toEditableText(priceText),
  )

  React.useEffect(() => {
    setLocalCoverImageSrc(coverImageSrc)
  }, [coverImageSrc])

  React.useEffect(() => {
    setLocalBrandName(toEditableText(brandName))
  }, [brandName])

  React.useEffect(() => {
    setLocalHeading(toEditableText(heading))
  }, [heading])

  React.useEffect(() => {
    setLocalAccentText(toEditableText(accentText ?? ''))
  }, [accentText])

  React.useEffect(() => {
    setLocalDescription(toEditableText(description ?? ''))
  }, [description])

  React.useEffect(() => {
    setLocalPriceText(toEditableText(priceText))
  }, [priceText])

  React.useEffect(
    () => () => {
      if (lastObjectUrlReference.current) {
        URL.revokeObjectURL(lastObjectUrlReference.current)
      }
    },
    [],
  )

  const onPickImageClick = () => {
    fileInputReference.current?.click()
  }

  const onImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.currentTarget.files?.[0]
    if (!nextFile) {
      return
    }

    if (lastObjectUrlReference.current) {
      URL.revokeObjectURL(lastObjectUrlReference.current)
    }

    const nextObjectUrl = URL.createObjectURL(nextFile)
    lastObjectUrlReference.current = nextObjectUrl
    setLocalCoverImageSrc(nextObjectUrl)
    onImageChange?.({
      file: nextFile,
      objectUrl: nextObjectUrl,
    })
    event.currentTarget.value = ''
  }

  return (
    <article
      className={cn(
        'group relative flex h-[620px] w-full flex-col overflow-hidden rounded-xl border border-border/60',
        'bg-card text-card-foreground',
        className,
      )}
      {...property}>
      <div className="relative h-[41%] min-h-[240px] w-full overflow-hidden">
        <img
          alt={coverImageAlt}
          src={localCoverImageSrc}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />

        {resolvedTagText ? (
          <span
            className={cn(
              'absolute top-4 left-4 rounded-md bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground',
              'uppercase tracking-wide',
            )}>
            {resolvedTagText}
          </span>
        ) : null}

        {isSetModeResolvedEnabled ? (
          <>
            <input
              ref={fileInputReference}
              type="file"
              accept={imageAccept}
              className="hidden"
              onChange={onImageInputChange}
            />
            <button
              type="button"
              onClick={onPickImageClick}
              className={cn(
                'absolute top-4 right-4 rounded-md bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur',
                'transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--chart-1)/50',
              )}>
              Upload image
            </button>
          </>
        ) : null}
      </div>

      <Paper
        as="section"
        type="gradient"
        isRoundedCornersDisabled
        className={cn('relative flex flex-1 flex-col gap-3 border-0 p-6')}>
        <div
          className={cn(
            'inline-flex items-center gap-2 uppercase',
            getTypographyClassName('CompactCaption'),
            'font-semibold tracking-wide',
          )}>
          {brandIcon ? (
            <span className="inline-flex size-5 items-center justify-center overflow-hidden rounded-sm">
              {brandIcon}
            </span>
          ) : null}

          {isSetModeResolvedEnabled ? (
            <EditableTypography
              value={localBrandName}
              onValueChange={setLocalBrandName}
              typography="CompactCaption"
              className="!h-auto"
            />
          ) : (
            <span>{localBrandName}</span>
          )}
        </div>

        {isSetModeResolvedEnabled ? (
          <EditableTypography
            value={localHeading}
            onValueChange={setLocalHeading}
            typography="Heading"
            className="!h-auto"
          />
        ) : (
          <h3
            className={cn(
              getTypographyClassName('Heading'),
              'leading-[1.08]',
              'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
            )}>
            {localHeading}
          </h3>
        )}

        {isSetModeResolvedEnabled ? (
          <EditableTypography
            value={localAccentText}
            onValueChange={setLocalAccentText}
            placeholder="Accent text"
            typography="Subheader"
            className="!h-auto text-(--chart-1)"
          />
        ) : localAccentText ? (
          <p
            className={cn(
              getTypographyClassName('Subheader'),
              'font-medium',
              'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
              'text-(--chart-1)',
            )}>
            {localAccentText}
          </p>
        ) : null}

        {isSetModeResolvedEnabled ? (
          <EditableTypography
            value={localDescription}
            onValueChange={setLocalDescription}
            placeholder="Description"
            typography="Subheader"
            className="!h-auto"
          />
        ) : localDescription ? (
          <p
            className={cn(
              getTypographyClassName('Subheader'),
              'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
            )}>
            {localDescription}
          </p>
        ) : null}

        {isSetModeResolvedEnabled ? (
          <EditableTypography
            value={localPriceText}
            onValueChange={setLocalPriceText}
            typography="Heading"
            className="mt-auto !h-auto pt-6"
          />
        ) : (
          <p className="mt-auto pt-6 text-5xl leading-none font-bold tracking-tight text-foreground">
            {localPriceText}
          </p>
        )}
      </Paper>
    </article>
  )
}
