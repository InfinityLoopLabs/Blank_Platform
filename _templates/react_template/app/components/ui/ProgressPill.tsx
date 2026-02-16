import { clsx } from '@infinityloop.labs/utils'

type OwnPropertyType = {
  progress: number
}

export const ProgressPill: FC<OwnPropertyType> = ({ progress }) => (
  <div className="relative">
    <div
      className={clsx(
        'px-3 py-1 bg-(--card) backdrop-blur-md bg-opacity-90 rounded-full border border-(--neon-main) overflow-hidden shadow-[0_0_12px_color-mix(in_oklab,var(--neon-main)_30%,transparent)]',
        progress > 80 && progress < 100 && 'border-glow-animate',
      )}>
      <div
        className={clsx(
          'absolute inset-0 bg-(--neon-main) opacity-20 progress-animate ',
          progress > 80 && progress < 100 && 'progress-glow-animate',
        )}
        style={{ width: `${progress}%` }}
      />
      <span
        className={clsx(
          'relative text-xs font-bold text-(--foreground)',
          progress > 80 && progress < 100 && 'text-glow-animate',
        )}>
        {progress}
        {'%'}
      </span>
    </div>
  </div>
)
