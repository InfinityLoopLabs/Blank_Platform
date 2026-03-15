import * as React from 'react'

import { cn } from '@/lib/utils'

const imageMaskUrlDictionary = {
  1: new URL('./masks/mask-01-octagon.svg', import.meta.url).href,
  2: new URL('./masks/mask-02-circle.svg', import.meta.url).href,
  3: new URL('./masks/mask-03-square.svg', import.meta.url).href,
} as const

export const IMAGE_MASK_OPTIONS = [
  {
    value: 0,
    label: 'No Mask',
  },
  {
    value: 1,
    label: 'Octagon Crop',
  },
  {
    value: 2,
    label: 'Circle Crop',
  },
  {
    value: 3,
    label: 'Square Crop',
  },
] as const

export type ImageMaskType = (typeof IMAGE_MASK_OPTIONS)[number]['value']

export type ImageMaskPositionValueType = {
  x: number
  y: number
}

export type ImageCropPositionValueType = {
  x: number
  y: number
}

type MaskOverlayPlacementType = {
  x: number
  y: number
  width: number
  height: number
}

export const getImageMaskUrlByType = (maskType: number): string | undefined =>
  imageMaskUrlDictionary[maskType as keyof typeof imageMaskUrlDictionary]

const parseMaskSizePercentage = (
  maskSize: string,
): { width: number; height: number } => {
  const [widthValue = '100%', heightValue = widthValue] = maskSize
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  const parsePercentageValue = (value: string): number | undefined => {
    const match = value.match(/^(-?\d+(?:\.\d+)?)%$/)
    if (!match) {
      return undefined
    }
    return Number(match[1])
  }
  const parsedWidth = parsePercentageValue(widthValue)
  const parsedHeight = parsePercentageValue(heightValue)
  if (
    parsedWidth === undefined ||
    parsedHeight === undefined ||
    !Number.isFinite(parsedWidth) ||
    !Number.isFinite(parsedHeight)
  ) {
    return {
      width: 100,
      height: 100,
    }
  }
  return {
    width: Math.max(0, parsedWidth),
    height: Math.max(0, parsedHeight),
  }
}

const getMaskOverlayPlacementByMaskSizeAndPosition = (
  maskSize: string,
  maskPositionValue: ImageMaskPositionValueType,
): MaskOverlayPlacementType => {
  const { width, height } = parseMaskSizePercentage(maskSize)
  const x = ((100 - width) * maskPositionValue.x) / 100
  const y = ((100 - height) * maskPositionValue.y) / 100
  return {
    x,
    y,
    width,
    height,
  }
}

const MaskOverlayShape = ({
  maskType,
  fillColor,
  strokeColor,
  strokeWidth,
  placement,
}: {
  maskType: ImageMaskType
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
  placement: MaskOverlayPlacementType
}) => {
  const hasFill = Boolean(fillColor)
  const hasStroke = Boolean(strokeColor) && Boolean(strokeWidth && strokeWidth > 0)
  if (!hasFill && !hasStroke) {
    return null
  }

  const commonShapeProperty = {
    fill: fillColor ?? 'none',
    stroke: strokeColor ?? 'none',
    strokeWidth: strokeWidth ?? 0,
    vectorEffect: 'non-scaling-stroke' as const,
  }
  const groupTransform = `translate(${placement.x} ${placement.y}) scale(${placement.width / 100} ${
    placement.height / 100
  })`

  if (maskType === 1) {
    return (
      <g transform={groupTransform}>
        <polygon
          points="29.2893,0 70.7107,0 100,29.2893 100,70.7107 70.7107,100 29.2893,100 0,70.7107 0,29.2893"
          {...commonShapeProperty}
        />
      </g>
    )
  }

  if (maskType === 2) {
    return (
      <g transform={groupTransform}>
        <circle cx="50" cy="50" r="50" {...commonShapeProperty} />
      </g>
    )
  }

  if (maskType === 3) {
    return (
      <g transform={groupTransform}>
        <rect width="100" height="100" rx="20.5556" {...commonShapeProperty} />
      </g>
    )
  }

  return null
}

type ImagePropertyType = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'className'
> & {
  className?: string
  maskType?: ImageMaskType
  isEditModeDisabled?: boolean
  imagePosition?: string
  isSquareCrop?: boolean
  cropX?: number
  cropY?: number
  cropPositionValue?: ImageCropPositionValueType
  defaultCropPositionValue?: ImageCropPositionValueType
  onCropPositionChange?: (value: ImageCropPositionValueType) => void
  maskSize?: string
  maskPositionValue?: ImageMaskPositionValueType
  maskFillColor?: string
  maskStrokeColor?: string
  maskStrokeWidth?: number
}

export const Image = ({
  className,
  maskType = 0,
  isEditModeDisabled = true,
  imagePosition,
  isSquareCrop = false,
  cropX = 50,
  cropY = 50,
  cropPositionValue,
  defaultCropPositionValue,
  onCropPositionChange,
  maskSize = '100% 100%',
  maskPositionValue,
  maskFillColor,
  maskStrokeColor,
  maskStrokeWidth = 1,
  alt = '',
  style,
  ...property
}: ImagePropertyType) => {
  const rootReference = React.useRef<HTMLDivElement | null>(null)
  const [isImageDragging, setIsImageDragging] = React.useState(false)
  const isCropPositionControlled = cropPositionValue !== undefined
  const [internalCropPositionValue, setInternalCropPositionValue] =
    React.useState<ImageCropPositionValueType>(
      defaultCropPositionValue ?? {
        x: cropX,
        y: cropY,
      },
    )
  const resolvedMaskUrl = getImageMaskUrlByType(maskType)
  const isMasked = Boolean(resolvedMaskUrl)
  const rawMaskPositionValue = maskPositionValue
  const resolvedMaskPositionX = Number.isFinite(rawMaskPositionValue?.x)
    ? Math.min(100, Math.max(0, rawMaskPositionValue.x))
    : 50
  const resolvedMaskPositionY = Number.isFinite(rawMaskPositionValue?.y)
    ? Math.min(100, Math.max(0, rawMaskPositionValue.y))
    : 50
  const resolvedMaskPosition = `${resolvedMaskPositionX}% ${resolvedMaskPositionY}%`
  const resolvedMaskPositionValue = {
    x: resolvedMaskPositionX,
    y: resolvedMaskPositionY,
  }
  const maskOverlayPlacement = getMaskOverlayPlacementByMaskSizeAndPosition(
    maskSize,
    resolvedMaskPositionValue,
  )
  const resolvedCropPositionValue = isCropPositionControlled
    ? cropPositionValue
    : internalCropPositionValue
  const resolvedCropX = Number.isFinite(resolvedCropPositionValue?.x)
    ? Math.min(100, Math.max(0, resolvedCropPositionValue.x))
    : Math.min(100, Math.max(0, cropX))
  const resolvedCropY = Number.isFinite(resolvedCropPositionValue?.y)
    ? Math.min(100, Math.max(0, resolvedCropPositionValue.y))
    : Math.min(100, Math.max(0, cropY))
  const resolvedImagePosition =
    imagePosition ?? `${resolvedCropX}% ${resolvedCropY}%`

  const applyCropPositionValue = React.useCallback(
    (nextValue: ImageCropPositionValueType) => {
      if (!isCropPositionControlled) {
        setInternalCropPositionValue(nextValue)
      }
      onCropPositionChange?.(nextValue)
    },
    [isCropPositionControlled, onCropPositionChange],
  )

  const updateCropPositionByPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const rootElement = rootReference.current
      if (!rootElement) {
        return
      }
      const bounds = rootElement.getBoundingClientRect()
      if (bounds.width <= 0 || bounds.height <= 0) {
        return
      }
      const normalizedX = ((clientX - bounds.left) / bounds.width) * 100
      const normalizedY = ((clientY - bounds.top) / bounds.height) * 100
      const nextMaskPositionValue = {
        x: Math.min(100, Math.max(0, normalizedX)),
        y: Math.min(100, Math.max(0, normalizedY)),
      }
      applyCropPositionValue(nextMaskPositionValue)
    },
    [applyCropPositionValue],
  )

  const isCropPositionEditable = !isEditModeDisabled

  React.useEffect(() => {
    if (isCropPositionEditable) {
      return
    }
    setIsImageDragging(false)
  }, [isCropPositionEditable])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isCropPositionEditable) {
      return
    }
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsImageDragging(true)
    updateCropPositionByPointer(event.clientX, event.clientY)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isCropPositionEditable || !isImageDragging) {
      return
    }
    updateCropPositionByPointer(event.clientX, event.clientY)
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isCropPositionEditable) {
      return
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsImageDragging(false)
  }

  const containerStyle = isMasked
    ? {
        WebkitMaskImage: `url("${resolvedMaskUrl}")`,
        maskImage: `url("${resolvedMaskUrl}")`,
        WebkitMaskSize: maskSize,
        maskSize,
        WebkitMaskPosition: resolvedMaskPosition,
        maskPosition: resolvedMaskPosition,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }
    : undefined
  const isMaskOverlayVisible =
    isMasked && (Boolean(maskFillColor) || Boolean(maskStrokeColor))

  return (
    <div
      ref={rootReference}
      style={containerStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={cn(
        'relative overflow-hidden',
        isSquareCrop && 'aspect-square',
        isMasked ? 'rounded-none' : 'rounded-(--radius)',
        isCropPositionEditable
          ? cn(
              'touch-none',
              isImageDragging ? 'cursor-grabbing' : 'cursor-grab',
            )
          : null,
        className,
      )}>
      <img
        alt={alt}
        draggable={false}
        onDragStart={event => event.preventDefault()}
        style={{
          objectPosition: resolvedImagePosition,
          ...style,
        }}
        className={cn('block h-full w-full object-cover select-none')}
        {...property}
      />
      {isMaskOverlayVisible ? (
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full">
          <MaskOverlayShape
            maskType={maskType}
            fillColor={maskFillColor}
            strokeColor={maskStrokeColor}
            strokeWidth={maskStrokeWidth}
            placement={maskOverlayPlacement}
          />
        </svg>
      ) : null}
    </div>
  )
}
