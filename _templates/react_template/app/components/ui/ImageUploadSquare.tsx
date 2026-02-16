import React, { useRef, type ChangeEvent, type FC, type ReactNode } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'
import { Plus, Trash2 } from 'lucide-react'
import { IconCircleButton } from '@components/ui/IconCircleButton'

export type OwnPropertyType = {
  className?: string
  imageUrl?: Nullable<string>
  label: string
  accept?: string
  isDisabled?: boolean
  onSelect?: VoidFunction
  onUpload?: Callback<File>
  onDelete?: VoidFunction
  renderActions?: () => ReactNode
}

export const ImageUploadSquare: FC<OwnPropertyType> = ({
  className,
  imageUrl,
  label,
  onSelect,
  onUpload,
  onDelete,
  accept,
  isDisabled,
  renderActions,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onTriggerUploadHandler = () => {
    if (!onUpload || isDisabled) {
      return
    }

    const input = fileInputRef.current
    if (!input) {
      return
    }

    input.value = ''
    input.click()
  }

  const onContainerClickHandler = () => {
    if (isDisabled) {
      return
    }

    if (onUpload) {
      onTriggerUploadHandler()

      return
    }

    onSelect?.()
  }

  const onFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onUpload) {
      return
    }

    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }

    event.target.value = ''
  }

  return (
    <div
      className={clsx(
        'relative h-[260px] rounded-(--radius) border border-(--border) overflow-hidden cursor-pointer transition-all duration-200 hover:border-(--neon-main)',
        imageUrl ? 'bg-black' : 'bg-(--card)',
        isDisabled && 'opacity-60 pointer-events-none',
        className,
      )}
      onClick={onContainerClickHandler}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Draft preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <Flex middle className="h-full w-full">
          <Flex column middle className="gap-4">
            <Plus className="w-10 h-10 text-(--muted-foreground)" />
            <span className="text-sm text-(--muted-foreground)">
              Upload image
            </span>
          </Flex>
        </Flex>
      )}
      <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-widest text-white">
        {label}
      </div>
      {imageUrl &&
        (renderActions ? (
          <div
            className="absolute top-3 right-3 flex gap-2"
            onClick={event => event.stopPropagation()}>
            {renderActions()}
          </div>
        ) : (
          onDelete && (
            <IconCircleButton
              className="absolute top-3 right-3"
              icon={<Trash2 className="w-4 h-4" />}
              aria-label="Delete image"
              isDisabled={isDisabled}
              onClick={event => {
                event.stopPropagation()
                onDelete()
              }}
            />
          )
        ))}
      {onUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || 'image/*'}
          className="hidden"
          onChange={onFileChangeHandler}
        />
      )}
    </div>
  )
}
