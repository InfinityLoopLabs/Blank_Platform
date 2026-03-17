import * as React from 'react'

import { Image } from '@/components/atoms/Image'
import { Paper } from '@/components/atoms/Paper'
import { Tag } from '@/components/atoms/Tag'
import { Typography } from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'
import type { StoreSlideTagItemType } from '@/components/molecules/SlideTemplates'
import { cn } from '@/lib/utils'

export type BigHorizontalSlidePropertyType = {
  coverImageSrc: string
  brandName: string
  heading: string
  description: string
  tagText?: string
  tags?: StoreSlideTagItemType[]
  isEditModeEnabled?: boolean
  isEditModeDisabled?: boolean
  onTagClick?: (id: string) => void
  onTagLabelChange?: (id: string, value: string) => void
}

export const BigHorizontalSlide = ({
  coverImageSrc,
  brandName,
  heading,
  description,
  tagText,
  tags,
  isEditModeEnabled = false,
  isEditModeDisabled = false,
  onTagClick,
  onTagLabelChange,
}: BigHorizontalSlidePropertyType) => {
  const isEditModeResolvedEnabled = isEditModeEnabled && !isEditModeDisabled
  const [localCoverImageSrc, setLocalCoverImageSrc] =
    React.useState(coverImageSrc)
  const [localBrandName, setLocalBrandName] = React.useState(brandName)
  const [localHeading, setLocalHeading] = React.useState(heading)
  const [localDescription, setLocalDescription] = React.useState(description)
  const [localTagText, setLocalTagText] = React.useState(tagText ?? '')
  const fileInputReference = React.useRef<HTMLInputElement | null>(null)
  const lastObjectUrlReference = React.useRef<string | null>(null)

  React.useEffect(() => {
    setLocalCoverImageSrc(coverImageSrc)
  }, [coverImageSrc])

  React.useEffect(() => {
    setLocalBrandName(brandName)
  }, [brandName])

  React.useEffect(() => {
    setLocalHeading(heading)
  }, [heading])

  React.useEffect(() => {
    setLocalDescription(description)
  }, [description])

  React.useEffect(() => {
    setLocalTagText(tagText ?? '')
  }, [tagText])

  React.useEffect(
    () => () => {
      if (lastObjectUrlReference.current) {
        URL.revokeObjectURL(lastObjectUrlReference.current)
      }
    },
    [],
  )

  const resolvedTags = React.useMemo<StoreSlideTagItemType[]>(() => {
    if (tags?.length) {
      return tags
    }

    if (!localTagText) {
      return []
    }

    return [
      {
        id: 'primary-tag',
        label: localTagText,
        type: 'default',
      },
    ]
  }, [tags, localTagText])

  const topLeftTags = React.useMemo(
    () => resolvedTags.filter(tag => tag.position !== 'bottom-right'),
    [resolvedTags],
  )
  const bottomRightTags = React.useMemo(
    () => resolvedTags.filter(tag => tag.position === 'bottom-right'),
    [resolvedTags],
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
    event.currentTarget.value = ''
  }

  return (
    <Paper
      type="gradient"
      isRoundedCornersDisabled
      className="relative flex h-[520px] w-full flex-col overflow-hidden border-0 p-0">
      <div className="relative h-[340px] w-full overflow-hidden">
        <Image
          src={localCoverImageSrc}
          alt={localHeading}
          isEditModeDisabled={!isEditModeResolvedEnabled}
          className="h-full w-full"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />

        {topLeftTags.length ? (
          <div className="absolute top-3 left-3 z-10 flex max-w-[calc(100%-8rem)] flex-wrap gap-2">
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
                  if (!tags?.length) {
                    setLocalTagText(nextValue)
                  }
                }}
                onClick={() => {
                  tag.onClick?.(tag.id)
                  onTagClick?.(tag.id)
                }}
              />
            ))}
          </div>
        ) : null}

        {bottomRightTags.length ? (
          <div className="absolute right-3 bottom-3 z-10 flex max-w-[calc(100%-2rem)] flex-wrap justify-end gap-2">
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
              />
            ))}
          </div>
        ) : null}

        {isEditModeResolvedEnabled ? (
          <>
            <input
              ref={fileInputReference}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageInputChange}
            />
            <button
              type="button"
              onClick={onPickImageClick}
              className="absolute top-3 right-3 rounded-md bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur">
              Upload image
            </button>
          </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
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
            element="p"
            className="font-semibold uppercase tracking-wide">
            {localBrandName}
          </Typography>
        )}

        {isEditModeResolvedEnabled ? (
          <EditableTypography
            value={localHeading}
            onValueChange={setLocalHeading}
            typography="SectionHeader"
            className="!h-auto"
          />
        ) : (
          <Typography
            typography="SectionHeader"
            element="h3"
            className="overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
            {localHeading}
          </Typography>
        )}

        {isEditModeResolvedEnabled ? (
          <EditableTypography
            value={localDescription}
            onValueChange={setLocalDescription}
            typography="BodySmall"
            className="!h-auto"
          />
        ) : (
          <Typography
            typography="BodySmall"
            element="p"
            color="muted-foreground"
            className={cn(
              'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]',
            )}>
            {localDescription}
          </Typography>
        )}
      </div>
    </Paper>
  )
}
