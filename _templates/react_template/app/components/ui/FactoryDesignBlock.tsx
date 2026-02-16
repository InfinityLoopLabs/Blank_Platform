import React, { type FC, useId } from 'react'
import { clsx } from '@infinityloop.labs/utils'
import { Trash2 } from 'lucide-react'
import { iconsDictionary, type IconKeyType } from '@constants/icons'
import { IconCircleButton } from './IconCircleButton'
import { ImageUploadSquare } from './ImageUploadSquare'

export const FACTORY_DESIGN_LAYOUTS = [
  'image-left',
  'image-right',
  'image-top',
  'image-bottom',
] as const

export type FactoryDesignLayoutType = (typeof FACTORY_DESIGN_LAYOUTS)[number]

export const resolveFactoryDesignLayout = (
  layoutValue?: string | null,
): FactoryDesignLayoutType | undefined => {
  if (!layoutValue) {
    return undefined
  }

  const normalizedLayoutValue = layoutValue
    .trim()
    .toLowerCase()
    .replace(/_/g, '-') as FactoryDesignLayoutType

  return FACTORY_DESIGN_LAYOUTS.find(
    layoutItem => layoutItem === normalizedLayoutValue,
  )
}

const layoutConfiguration: Record<
  FactoryDesignLayoutType,
  { wrapper: string; image: string; content: string }
> = {
  'image-left': {
    wrapper: 'flex flex-col lg:flex-row',
    image: 'lg:order-1',
    content: 'lg:order-2',
  },
  'image-right': {
    wrapper: 'flex flex-col lg:flex-row',
    image: 'lg:order-2',
    content: 'lg:order-1',
  },
  'image-top': {
    wrapper: 'flex flex-col',
    image: 'order-1',
    content: 'order-2',
  },
  'image-bottom': {
    wrapper: 'flex flex-col',
    image: 'order-2',
    content: 'order-1',
  },
}

export type FactoryDesignBlockFieldKeyType =
  | 'title'
  | 'statusLabel'
  | 'description'
  | 'features'
  | 'buildingPrefixLabel'
  | 'buildingTitle'
  | 'buildingIcon'
  | 'footerLabel'
  | 'accentLabel'
  | 'layout'
  | 'mainImageUrl'
  | 'hexagonImageUrl'

export type FactoryDesignBlockValueType = {
  title: string
  statusLabel: string
  description: string
  features: string
  buildingPrefixLabel: string
  buildingTitle: string
  buildingIcon: string
  footerLabel: string
  accentLabel: string
  layout: FactoryDesignLayoutType
  mainImageUrl?: string
  hexagonImageUrl?: string
}

export const FACTORY_DESIGN_DEFAULT_VALUES: FactoryDesignBlockValueType = {
  title: '',
  statusLabel: '',
  description: '',
  features: '',
  buildingPrefixLabel: '',
  buildingTitle: '',
  buildingIcon: '',
  footerLabel: '',
  accentLabel: 'NOMINAL',
  layout: 'image-left',
  mainImageUrl: '',
  hexagonImageUrl: '',
}

export type FactoryDesignBlockPropertyType = {
  className?: string
  values: FactoryDesignBlockValueType
  isEditMode?: boolean
  isSubmitting?: boolean
  actionLabel?: string
  onFieldChange?: Callback<[FactoryDesignBlockFieldKeyType, string]>
  onSubmit?: VoidFunction
  onUploadMainImage?: Callback<File>
  onUploadHexagonImage?: Callback<File>
  onClearMainImage?: VoidFunction
  onClearHexagonImage?: VoidFunction
}

const onSplitFeatures = (features: string) =>
  features
    .split('\n')
    .map(feature => feature.trim())
    .filter(feature => feature.length > 0)

export const FactoryDesignBlock: FC<FactoryDesignBlockPropertyType> = ({
  className,
  values,
  isEditMode,
  isSubmitting,
  actionLabel = 'Save',
  onFieldChange,
  onSubmit,
  onUploadMainImage,
  onUploadHexagonImage,
  onClearMainImage,
  onClearHexagonImage,
}) => {
  const iconOptionsListId = useId()
  const iconOptions = Object.keys(iconsDictionary) as Array<IconKeyType>
  const layoutValue = resolveFactoryDesignLayout(values.layout) || 'image-left'
  const layoutClasses = layoutConfiguration[layoutValue]
  const normalizedFeatures = onSplitFeatures(values.features)
  const canAutoSubmit = Boolean(isEditMode && onSubmit)
  const onAutoSubmit = () => {
    if (!canAutoSubmit || isSubmitting) {
      return
    }

    onSubmit?.()
  }
  const onMainImageUploadHandler = onUploadMainImage
  const onHexagonImageUploadHandler = onUploadHexagonImage
  const onClearMainImageHandler = onClearMainImage
    ? () => {
        onClearMainImage()
        onAutoSubmit()
      }
    : undefined
  const onClearHexagonImageHandler = onClearHexagonImage
    ? () => {
        onClearHexagonImage()
        onAutoSubmit()
      }
    : undefined

  const resolveBuildingIconElement = (iconKey?: string | null) => {
    if (!iconKey) {
      return null
    }

    return iconsDictionary[iconKey as IconKeyType] || null
  }
  const buildingIconPreview =
    resolveBuildingIconElement(values.buildingIcon) ||
    values.buildingIcon ||
    '🏗️'

  const renderImageArea = () =>
    isEditMode && onUploadMainImage ? (
      <ImageUploadSquare
        label="Main image"
        imageUrl={values.mainImageUrl}
        onUpload={onMainImageUploadHandler}
        renderActions={
          values.mainImageUrl && onClearMainImageHandler
            ? () => (
                <IconCircleButton
                  icon={<Trash2 className="h-4 w-4" />}
                  aria-label="Remove main image"
                  onClick={onClearMainImageHandler}
                />
              )
            : undefined
        }
        className="h-full min-h-[320px]"
      />
    ) : values.mainImageUrl ? (
      <img
        src={values.mainImageUrl}
        alt={values.title}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-gray-900">
        <span className="text-xl text-gray-700 uppercase tracking-widest">
          Image Placeholder
        </span>
      </div>
    )

  const renderHexagonImage = (sizeClass = 'h-32 w-32') =>
    isEditMode && onUploadHexagonImage ? (
      <ImageUploadSquare
        label="Hexagon image"
        imageUrl={values.hexagonImageUrl}
        onUpload={onHexagonImageUploadHandler}
        renderActions={
          values.hexagonImageUrl && onClearHexagonImageHandler
            ? () => (
                <IconCircleButton
                  icon={<Trash2 className="h-4 w-4" />}
                  aria-label="Remove hexagon image"
                  onClick={onClearHexagonImageHandler}
                />
              )
            : undefined
        }
        className="h-full min-h-[220px]"
      />
    ) : values.hexagonImageUrl ? (
      <div
        className={clsx(
          'relative overflow-hidden rounded-(--radius) bg-gray-900',
          sizeClass,
        )}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${values.hexagonImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    ) : (
      <div
        className={clsx(
          'relative overflow-hidden rounded-(--radius) bg-gray-900',
          sizeClass,
        )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-center text-xs uppercase tracking-wider text-gray-500">
            Icon Placeholder
          </span>
        </div>
      </div>
    )

  const onChangeField =
    (field: FactoryDesignBlockFieldKeyType) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      onFieldChange?.([field, event.target.value])
    }

  return (
    <div
      className={clsx(
        'relative min-h-screen overflow-hidden rounded-(--radius) bg-black text-white',
        layoutClasses.wrapper,
        className,
      )}>
      {isEditMode && (
        <datalist id={iconOptionsListId}>
          {iconOptions.map(iconKey => (
            <option key={iconKey} value={iconKey} />
          ))}
        </datalist>
      )}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none">
        <p className="text-xs tracking-[0.6em] text-gray-700 whitespace-nowrap uppercase">
          {values.accentLabel}
        </p>
      </div>

      <div
        className={clsx(
          'relative isolate flex-1 min-h-[320px]',
          layoutClasses.image,
        )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 z-10 pointer-events-none" />
        {renderImageArea()}
      </div>

      <div
        className={clsx(
          'relative flex flex-1 flex-col justify-center gap-6 px-6 py-8 lg:pl-16 lg:pr-32 lg:py-12',
          layoutClasses.content,
        )}>
        {isEditMode ? (
          <>
            <div className="grid w-full gap-4 md:grid-cols-2">
              <input
                type="text"
                value={values.title}
                placeholder="Title"
                className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-3xl font-bold uppercase tracking-[0.2em] text-(--neon-main) outline-none"
                onChange={onChangeField('title')}
                onBlur={onAutoSubmit}
              />
              <input
                type="text"
                value={values.statusLabel}
                placeholder="Status label"
                className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-lg text-gray-300 uppercase tracking-widest outline-none"
                onChange={onChangeField('statusLabel')}
                onBlur={onAutoSubmit}
              />
            </div>

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  Building prefix label
                </label>
                <input
                  type="text"
                  value={values.buildingPrefixLabel}
                  className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none"
                  onChange={onChangeField('buildingPrefixLabel')}
                  onBlur={onAutoSubmit}
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                    Building icon
                  </label>
                  <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-(--neon-main)">
                    {buildingIconPreview}
                  </div>
                    <input
                      type="text"
                      value={values.buildingIcon}
                      placeholder="Icon key"
                      list={iconOptionsListId}
                      className="w-40 rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none"
                      onChange={onChangeField('buildingIcon')}
                      onBlur={onAutoSubmit}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                    Building title
                  </label>
                  <input
                    type="text"
                    value={values.buildingTitle}
                    className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none"
                    onChange={onChangeField('buildingTitle')}
                    onBlur={onAutoSubmit}
                  />
                </div>
              </div>
            </div>

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  Description
                </label>
                <textarea
                  value={values.description}
                  rows={4}
                  className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none"
                  onChange={onChangeField('description')}
                  onBlur={onAutoSubmit}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  Features
                </label>
                <textarea
                  value={values.features}
                  rows={4}
                  className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none"
                  onChange={onChangeField('features')}
                  onBlur={onAutoSubmit}
                />
              </div>
            </div>

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  Accent label
                </label>
                <input
                  type="text"
                  value={values.accentLabel}
                  className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none"
                  onChange={onChangeField('accentLabel')}
                  onBlur={onAutoSubmit}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  Footer label
                </label>
                <input
                  type="text"
                  value={values.footerLabel}
                  className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none"
                  onChange={onChangeField('footerLabel')}
                  onBlur={onAutoSubmit}
                />
              </div>
            </div>

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  Layout
                </label>
                <select
                  value={values.layout}
                  className="w-full rounded-(--radius) border border-(--border) bg-black px-3 py-2 text-white outline-none"
                  onChange={onChangeField('layout')}
                  onBlur={onAutoSubmit}>
                  {FACTORY_DESIGN_LAYOUTS.map(layoutValue => (
                    <option key={layoutValue} value={layoutValue}>
                      {layoutValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  Hexagon image
                </label>
                <div className="flex items-center gap-4">
                  {renderHexagonImage()}
                </div>
              </div>
            </div>

            {isSubmitting && onSubmit && (
              <div className="flex justify-end">
                <span className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                  {actionLabel}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-12 space-y-3">
              <h1 className="text-4xl font-bold tracking-widest text-(--neon-main)">
                {values.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-xl text-gray-300 uppercase tracking-widest">
                  {values.statusLabel}
                </p>
              </div>
              <div className="h-1 w-24 bg-(--neon-main)" />
            </div>

            <div className="mb-8 flex justify-start">
              {renderHexagonImage('h-48 w-48')}
            </div>

            <div className="mb-8 text-gray-300 leading-relaxed">
              <p className="text-base italic">{values.description}</p>
            </div>

            <div className="mb-8">
              <div className="mb-6 flex items-center gap-3">
                <p className="text-lg text-gray-400">
                  {values.buildingPrefixLabel}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs text-(--neon-main)">
                    {buildingIconPreview}
                  </div>
                  <span className="text-lg text-white">
                    {values.buildingTitle}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {normalizedFeatures.map((feature, index) => (
                  <div
                    key={`${feature}-${index}`}
                    className="flex items-start gap-3">
                    <span className="text-(--neon-main)">▸</span>
                    <p className="text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {values.footerLabel && (
              <div className="absolute bottom-8 right-8">
                <p className="text-gray-600 text-sm tracking-wider uppercase">
                  {values.footerLabel}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
