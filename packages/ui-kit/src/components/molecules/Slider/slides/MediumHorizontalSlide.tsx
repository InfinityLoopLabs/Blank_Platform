import * as React from 'react'

import { Image } from '@/components/atoms/Image'
import { Paper } from '@/components/atoms/Paper'
import { Tag } from '@/components/atoms/Tag'
import { Typography } from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'

export type MediumHorizontalSlidePropertyType = {
  coverImageSrc: string
  brandName: string
  heading: string
  viewsText: string
  tagText?: string
  isEditModeEnabled?: boolean
  isEditModeDisabled?: boolean
}

export const MediumHorizontalSlide = ({
  coverImageSrc,
  brandName,
  heading,
  viewsText,
  tagText,
  isEditModeEnabled = false,
  isEditModeDisabled = false,
}: MediumHorizontalSlidePropertyType) => {
  const isEditModeResolvedEnabled = isEditModeEnabled && !isEditModeDisabled
  const [localCoverImageSrc, setLocalCoverImageSrc] =
    React.useState(coverImageSrc)
  const [localBrandName, setLocalBrandName] = React.useState(brandName)
  const [localHeading, setLocalHeading] = React.useState(heading)
  const [localViewsText, setLocalViewsText] = React.useState(viewsText)
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
    setLocalViewsText(viewsText)
  }, [viewsText])

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
      type="light"
      isGradientEnabled
      isRoundedCornersDisabled
      className="relative flex h-[360px] w-full flex-col gap-3 border-0 p-2">
      <div className="relative h-[220px] w-full overflow-hidden rounded-lg">
        <Image
          src={localCoverImageSrc}
          alt={localHeading}
          isEditModeDisabled={!isEditModeResolvedEnabled}
          className="h-full w-full"
        />

        {localTagText ? (
          <Tag
            label={localTagText}
            type="default"
            className="absolute top-2 left-2"
            isEditModeEnabled={isEditModeResolvedEnabled}
            isEditModeDisabled={!isEditModeResolvedEnabled}
            onLabelChange={setLocalTagText}
          />
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
              className="absolute top-2 right-2 rounded-md bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur">
              Upload image
            </button>
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 px-1 pb-1">
        {isEditModeResolvedEnabled ? (
          <EditableTypography
            value={localBrandName}
            onValueChange={setLocalBrandName}
            typography="Action"
            isEditModeDisabled={!isEditModeResolvedEnabled}
            className="!h-auto"
          />
        ) : (
          <Typography
            typography="Action"
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
            isEditModeDisabled={!isEditModeResolvedEnabled}
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
            value={localViewsText}
            onValueChange={setLocalViewsText}
            typography="BodySmall"
            isEditModeDisabled={!isEditModeResolvedEnabled}
            className="!h-auto pt-1"
          />
        ) : (
          <Typography
            typography="BodySmall"
            element="p"
            color="muted-foreground"
            className="pt-1">
            {localViewsText}
          </Typography>
        )}
      </div>
    </Paper>
  )
}
