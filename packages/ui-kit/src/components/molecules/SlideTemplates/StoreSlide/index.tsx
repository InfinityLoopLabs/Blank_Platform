import * as React from 'react'

import { Image, type ImagePropertyType } from '@/components/atoms/Image'
import { Paper } from '@/components/atoms/Paper'
import { Tag, type TagType } from '@/components/atoms/Tag'
import {
  Typography,
  type TypographyColorType,
} from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'
import { cn } from '@/lib/utils'

export type StoreSlideImageChangePayloadType = {
  file: File
  objectUrl: string
}

export type StoreSlideTagItemType = {
  id: string
  label: string
  type?: TagType
  position?: 'top-left' | 'bottom-right'
  color?: TypographyColorType
  textColor?: TypographyColorType
  isLoading?: boolean
  onClick?: (id: string) => void
  onLabelChange?: (id: string, value: string) => void
}

export type StoreSlidePropertyType = Omit<
  React.HTMLAttributes<HTMLElement>,
  'title'
> & {
  isSetModeEnabled?: boolean
  isEditModeEnabled?: boolean
  isEditModeDisabled?: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  setModelEnabled?: boolean
  coverImageSrc: string
  coverImageAlt?: string
  isImageLoading?: boolean
  imageProps?: Omit<ImagePropertyType, 'src' | 'alt' | 'className'>
  imageAccept?: string
  onImageChange?: (payload: StoreSlideImageChangePayloadType) => void
  brandName: React.ReactNode
  brandIcon?: React.ReactNode
  heading: React.ReactNode
  accentText?: React.ReactNode
  description?: React.ReactNode
  priceText: React.ReactNode
  tagText?: string
  tagType?: TagType
  tagColor?: TypographyColorType
  tagTextColor?: TypographyColorType
  tags?: StoreSlideTagItemType[]
  onTagClick?: (id: string) => void
  onTagLabelChange?: (id: string, value: string) => void
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
  isEditModeEnabled = false,
  isEditModeDisabled = false,
  setModelEnabled,
  coverImageSrc,
  coverImageAlt = 'Slide cover image',
  isImageLoading,
  imageProps,
  imageAccept = 'image/*',
  onImageChange,
  brandName,
  brandIcon,
  heading,
  accentText,
  description,
  priceText,
  tagText,
  tagType = 'default',
  tagColor,
  tagTextColor,
  tags,
  onTagClick,
  onTagLabelChange,
  badgeText,
  ...property
}: StoreSlidePropertyType) => {
  const isEditModeResolvedEnabled =
    (isEditModeEnabled || isSetModeEnabled || Boolean(setModelEnabled)) &&
    !isEditModeDisabled
  const {
    isEditModeDisabled: isImageEditModeDisabled,
    isLoading: isImageLoadingFromProps,
    ...restImageProperty
  } = imageProps ?? {}
  const isImageResolvedLoading =
    isImageLoading ?? isImageLoadingFromProps ?? false
  const isImageResolvedEditModeDisabled =
    isImageEditModeDisabled ?? !isEditModeResolvedEnabled
  const resolvedTagText = tagText ?? toEditableText(badgeText)
  const resolvedTags = React.useMemo<StoreSlideTagItemType[]>(() => {
    if (tags?.length) {
      return tags
    }
    if (!resolvedTagText) {
      return []
    }

    return [
      {
        id: 'primary-tag',
        label: resolvedTagText,
        type: tagType,
        color: tagColor,
        textColor: tagTextColor,
      },
    ]
  }, [tags, resolvedTagText, tagType, tagColor, tagTextColor])
  const topLeftTags = React.useMemo(
    () => resolvedTags.filter(tag => tag.position !== 'bottom-right'),
    [resolvedTags],
  )
  const bottomRightTags = React.useMemo(
    () => resolvedTags.filter(tag => tag.position === 'bottom-right'),
    [resolvedTags],
  )
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
    if (isImageResolvedLoading) {
      return
    }
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
        <Image
          alt={coverImageAlt}
          src={localCoverImageSrc}
          isLoading={isImageResolvedLoading}
          isEditModeDisabled={isImageResolvedEditModeDisabled}
          className={cn(
            'h-full w-full',
            '[&>img]:transition-transform [&>img]:duration-500 group-hover:[&>img]:scale-[1.025]',
          )}
          {...restImageProperty}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />

        {topLeftTags.length ? (
          <div
            className={cn(
              'absolute top-4 left-4 z-10 flex flex-wrap gap-2',
              isEditModeResolvedEnabled
                ? 'max-w-[calc(100%-13rem)]'
                : 'max-w-[calc(100%-1rem)]',
            )}>
            {topLeftTags.map(tag => (
              <Tag
                key={tag.id}
                label={tag.label}
                type={tag.type}
                color={tag.color}
                textColor={tag.textColor}
                isLoading={tag.isLoading}
                isEditModeEnabled={isEditModeResolvedEnabled}
                isEditModeDisabled={!isEditModeResolvedEnabled}
                onLabelChange={nextValue => {
                  tag.onLabelChange?.(tag.id, nextValue)
                  onTagLabelChange?.(tag.id, nextValue)
                }}
                onClick={() => {
                  tag.onClick?.(tag.id)
                  onTagClick?.(tag.id)
                }}
                className={cn(
                  'max-w-full',
                  (tag.onClick || onTagClick) && 'cursor-pointer',
                )}
              />
            ))}
          </div>
        ) : null}

        {bottomRightTags.length ? (
          <div className="absolute right-4 bottom-4 z-10 flex max-w-[calc(100%-1rem)] flex-wrap justify-end gap-2">
            {bottomRightTags.map(tag => (
              <Tag
                key={tag.id}
                label={tag.label}
                type={tag.type}
                color={tag.color}
                textColor={tag.textColor}
                isLoading={tag.isLoading}
                isEditModeEnabled={isEditModeResolvedEnabled}
                isEditModeDisabled={!isEditModeResolvedEnabled}
                onLabelChange={nextValue => {
                  tag.onLabelChange?.(tag.id, nextValue)
                  onTagLabelChange?.(tag.id, nextValue)
                }}
                onClick={() => {
                  tag.onClick?.(tag.id)
                  onTagClick?.(tag.id)
                }}
                className={cn(
                  'max-w-full',
                  (tag.onClick || onTagClick) && 'cursor-pointer',
                )}
              />
            ))}
          </div>
        ) : null}

        {isEditModeResolvedEnabled ? (
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
              disabled={isImageResolvedLoading}
              className={cn(
                'absolute top-4 right-4 rounded-md bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur',
                'disabled:cursor-not-allowed disabled:opacity-60',
                'transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--chart-1)/50',
              )}>
              Upload image
            </button>
          </>
        ) : null}
      </div>

      <Paper
        as="section"
        type="light"
        isGradientEnabled
        isRoundedCornersDisabled
        className={cn('relative flex flex-1 flex-col gap-3 border-0 p-6')}>
        <div className="inline-flex items-center gap-2 uppercase">
          {brandIcon ? (
            <span className="inline-flex size-5 items-center justify-center overflow-hidden rounded-sm">
              {brandIcon}
            </span>
          ) : null}

          {isEditModeResolvedEnabled ? (
            <EditableTypography
              value={localBrandName}
              onValueChange={setLocalBrandName}
              typography="CompactCaption"
              contentClassName="font-semibold uppercase tracking-wide"
              className="!h-auto"
            />
          ) : (
            <Typography
              typography="CompactCaption"
              element="span"
              className="font-semibold uppercase tracking-wide">
              {localBrandName}
            </Typography>
          )}
        </div>

        {isEditModeResolvedEnabled ? (
          <EditableTypography
            value={localHeading}
            onValueChange={setLocalHeading}
            typography="Heading"
            contentClassName="leading-[1.08]"
            className="!h-auto"
          />
        ) : (
          <Typography
            typography="Heading"
            element="h3"
            className={cn(
              'leading-[1.08]',
              'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
            )}>
            {localHeading}
          </Typography>
        )}

        {isEditModeResolvedEnabled ? (
          <EditableTypography
            value={localAccentText}
            onValueChange={setLocalAccentText}
            placeholder="Accent text"
            typography="Subheader"
            color="chart-1"
            contentClassName="font-medium"
            className="!h-auto text-(--chart-1)"
          />
        ) : localAccentText ? (
          <Typography
            typography="Subheader"
            className={cn(
              'font-medium',
              'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
              'text-(--chart-1)',
            )}
            color="chart-1">
            {localAccentText}
          </Typography>
        ) : null}

        {isEditModeResolvedEnabled ? (
          <EditableTypography
            value={localDescription}
            onValueChange={setLocalDescription}
            placeholder="Description"
            typography="Subheader"
            className="!h-auto"
          />
        ) : localDescription ? (
          <Typography
            typography="Subheader"
            className={cn(
              'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
            )}>
            {localDescription}
          </Typography>
        ) : null}

        {isEditModeResolvedEnabled ? (
          <EditableTypography
            value={localPriceText}
            onValueChange={setLocalPriceText}
            typography="Heading"
            contentClassName="text-5xl leading-none font-bold tracking-tight"
            className="mt-auto !h-auto pt-6"
          />
        ) : (
          <Typography
            typography="Heading"
            element="p"
            className="mt-auto pt-6 text-5xl leading-none font-bold tracking-tight"
            color="foreground">
            {localPriceText}
          </Typography>
        )}
      </Paper>
    </article>
  )
}
