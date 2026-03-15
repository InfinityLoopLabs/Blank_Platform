import { clsx } from '@infinityloop.labs/utils'

export const RADIUS_CLASS_OPTIONS = [
  'rounded-none',
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-2xl',
  'rounded-3xl',
  'rounded-full',
  'rounded-(--radius)',
] as const

type RadiusClassType = (typeof RADIUS_CLASS_OPTIONS)[number]

type BorderRadiusShowcasePropertyType = {
  radiusClassName?: RadiusClassType
}

export function BorderRadiusShowcase({
  radiusClassName = 'rounded-(--radius)',
}: BorderRadiusShowcasePropertyType) {
  const surfaceClassName = clsx(
    'border border-(--border) bg-(--card) p-3',
    radiusClassName,
  )

  return (
    <div className="p-2 text-(--foreground)">
      <div className="w-full max-w-md">
        <div className={surfaceClassName}>
          <div className="space-y-2">
            <div
              className={clsx(
                'h-16 border border-(--border) bg-(--background)',
                radiusClassName,
              )}
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={clsx(
                  'border border-(--border) bg-(--background) px-3 py-1.5 text-sm',
                  radiusClassName,
                )}>
                Primary
              </button>
              <button
                type="button"
                className={clsx(
                  'border border-(--border) bg-(--muted) px-3 py-1.5 text-sm',
                  radiusClassName,
                )}>
                Secondary
              </button>
            </div>
            <input
              readOnly
              value={radiusClassName}
              className={clsx(
                'w-full border border-(--border) bg-(--background) px-2.5 py-1.5 text-sm text-(--muted-foreground)',
                radiusClassName,
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
