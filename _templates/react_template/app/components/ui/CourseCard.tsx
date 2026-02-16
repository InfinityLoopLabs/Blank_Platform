import React, { useRef, useState, type FC } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreVertical,
  Play,
} from 'lucide-react'
import type { Swiper as SwiperClass } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { GlowingButton } from '@components/GlowingButton'
import { ProgressPill } from '@components/ui/ProgressPill'
import 'swiper/css'

const onGetPreviewSourcesHandler = (
  thumbnail?: Nullable<string>,
  previews: string[] = [],
) => (thumbnail ? [thumbnail, ...previews] : previews)

const onResolveSlideOffsetHandler = (thumbnail?: Nullable<string>) =>
  thumbnail ? 1 : 0

const onNormalizePreviewIndexHandler = (
  previewIndex: number,
  previewsLength: number,
) => {
  if (previewsLength === 0) {
    return -1
  }

  if (previewIndex < -1) {
    return -1
  }

  if (previewIndex >= previewsLength) {
    return previewsLength - 1
  }

  return previewIndex
}

const onConvertPreviewIndexToSlideHandler = (
  previewIndex: number,
  slideOffset: number,
  previewsLength: number,
) => onNormalizePreviewIndexHandler(previewIndex, previewsLength) + slideOffset

const onConvertSlideIndexToPreviewHandler = (
  slideIndex: number,
  slideOffset: number,
  previewsLength: number,
) => onNormalizePreviewIndexHandler(slideIndex - slideOffset, previewsLength)

export type OwnPropertyType = {
  id: string
  title: string
  description: string
  level: string
  duration: string
  progress: number
  tags: string[]
  previews?: string[]
  thumbnail?: Nullable<string>
  onNavigateCoursePreviewHandler: Callback<string>
  onNavigateCourseContinueHandler: Callback<string>
  dataTestId?: string
}

export const CourseCard: FC<OwnPropertyType> = ({
  id,
  title,
  description,
  level,
  duration,
  progress,
  tags,
  previews = [],
  thumbnail,
  onNavigateCoursePreviewHandler,
  onNavigateCourseContinueHandler,
  dataTestId,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(-1)
  const swiperInstanceRef = useRef<SwiperClass | null>(null)

  const previewSources = onGetPreviewSourcesHandler(thumbnail, previews)
  const slideOffset = onResolveSlideOffsetHandler(thumbnail)
  const hasMultiplePreviewSources = previewSources.length > 1
  const initialSlideIndex = onConvertPreviewIndexToSlideHandler(
    currentPreviewIndex,
    slideOffset,
    previews.length,
  )

  const onSyncSwiperSlideHandler = (previewIndex: number) => {
    const swiperInstance = swiperInstanceRef.current

    if (!swiperInstance) {
      return
    }

    const slideIndex = onConvertPreviewIndexToSlideHandler(
      previewIndex,
      slideOffset,
      previews.length,
    )

    if (hasMultiplePreviewSources) {
      swiperInstance.slideToLoop(slideIndex)
    } else {
      swiperInstance.slideTo(slideIndex)
    }
  }

  const onSwiperInitHandler = (swiperInstance: SwiperClass) => {
    swiperInstanceRef.current = swiperInstance
  }

  const onPreviewSlideChangeHandler = (swiperInstance: SwiperClass) => {
    const previewIndex = onConvertSlideIndexToPreviewHandler(
      swiperInstance.realIndex,
      slideOffset,
      previews.length,
    )

    setCurrentPreviewIndex(previewIndex)
  }

  const nextPreview = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setCurrentPreviewIndex(prevIndex => {
      if (previews.length === 0) {
        return -1
      }

      const nextIndex = prevIndex >= previews.length - 1 ? -1 : prevIndex + 1

      onSyncSwiperSlideHandler(nextIndex)

      return nextIndex
    })
  }

  const prevPreview = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setCurrentPreviewIndex(prevIndex => {
      if (previews.length === 0) {
        return -1
      }

      const nextIndex = (() => {
        if (prevIndex === -1) {
          return previews.length - 1
        }

        if (prevIndex <= 0) {
          return -1
        }

        return prevIndex - 1
      })()

      onSyncSwiperSlideHandler(nextIndex)

      return nextIndex
    })
  }

  const onCardClickHandler = () => {
    if (progress === 100) {
      onNavigateCourseContinueHandler(id)

      return
    }

    onNavigateCoursePreviewHandler(id)
  }

  return (
    /* Карточка курса: Начало */
    <Flex
      data-testid={dataTestId}
      onClick={onCardClickHandler}
      className={clsx('cursor-pointer')}>
      {/* Обёртка карточки с hover-анимацией: Начало */}
      <article
        className="group relative bg-(--card) rounded-(--radius) border border-(--border) overflow-hidden transition-all duration-200 hover:border-(--neon-main) hover:shadow-[0_0_24px_color-mix(in_oklab,var(--neon-main)_30%,transparent)] focus-within:ring-2 focus-within:ring-(--ring) focus-within:ring-offset-2 focus-within:ring-offset-(--background)"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered
            ? 'perspective(1000px) rotateX(1deg) rotateY(-1deg)'
            : 'none',
          transition:
            'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms, box-shadow 180ms',
        }}>
        {/* Превью и прогресс: Начало */}
        <div
          style={{ height: '400px' }}
          className="relative  overflow-hidden bg-(--muted) group">
          {/* Свайпер: Начало */}
          {previewSources.length > 0 ? (
            <Swiper
              className="h-full w-full"
              slidesPerView={1}
              loop={hasMultiplePreviewSources}
              allowTouchMove={hasMultiplePreviewSources}
              onClick={(_, event) => {
                event.stopPropagation()
              }}
              onSwiper={onSwiperInitHandler}
              onSlideChange={onPreviewSlideChangeHandler}
              initialSlide={initialSlideIndex}>
              {previewSources.map((previewSource, slideIndex) => (
                <SwiperSlide
                  key={`${id}-preview-${slideIndex}`}
                  className="!h-full">
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={previewSource || thumbnail || '/placeholder.svg'}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-220 z-10"
                      style={{
                        objectPosition: 'center 15%',
                        transform: isHovered
                          ? 'scale(1.05) translateY(-2px)'
                          : 'scale(1)',
                        transition:
                          'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={thumbnail || '/placeholder.svg'}
              alt={title}
              onClick={event => {
                event.preventDefault()
              }}
              className="w-full h-full object-cover transition-transform duration-220 z-10"
              style={{
                objectPosition: 'center 15%',
                transform: isHovered
                  ? 'scale(1.05) translateY(-2px)'
                  : 'scale(1)',
                transition: 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            />
          )}
          {/* Свайпер: Конец */}

          {/* Слайдер: Начало */}
          {previewSources.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {previewSources.map((_, slideIndex) => {
                const previewIndex = onConvertSlideIndexToPreviewHandler(
                  slideIndex,
                  slideOffset,
                  previews.length,
                )

                return (
                  <div
                    key={`${id}-${slideIndex}`}
                    className={clsx('p-1 cursor-pointer')}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      setCurrentPreviewIndex(() => {
                        onSyncSwiperSlideHandler(previewIndex)

                        return previewIndex
                      })
                    }}>
                    <button
                      onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        setCurrentPreviewIndex(() => {
                          onSyncSwiperSlideHandler(previewIndex)

                          return previewIndex
                        })
                      }}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-(--neon-main)"
                      style={{
                        backgroundColor:
                          currentPreviewIndex === previewIndex
                            ? 'var(--neon-main)'
                            : 'rgba(255,255,255,0.4)',
                        width:
                          currentPreviewIndex === previewIndex ? '20px' : '6px',
                      }}
                      aria-label={`Go to preview ${previewIndex + 1}`}
                    />
                  </div>
                )
              })}
            </div>
          )}
          {/* Слайдер: Конец */}

          {previews.length && thumbnail && (
            <button
              onClick={prevPreview}
              className="cursor-pointer z-20 absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-(--neon-main)"
              aria-label="Previous preview">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          )}

          {previews.length && thumbnail && (
            <button
              onClick={nextPreview}
              className="cursor-pointer z-20 absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-(--neon-main)"
              aria-label="Next preview">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-(--card) via-transparent to-transparent opacity-60" />

          {progress > 0 && (
            <div className="absolute top-2 right-2 z-20">
              <ProgressPill progress={progress} />
            </div>
          )}
        </div>
        {/* Превью и прогресс: Конец */}

        {/* Текстовое содержание: Начало */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-balance">{title}</h3>

          <p
            className="text-sm text-(--muted-foreground) mb-3 line-clamp-3"
            style={{ minHeight: '3.75rem' }}>
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-(--secondary) text-(--secondary-foreground) rounded-(--radius) border border-(--border)">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-(--muted-foreground) mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <span className="px-2 py-0.5 bg-(--accent) text-(--accent-foreground) rounded text-xs font-medium">
              {level}
            </span>
          </div>

          {/* Блок действий: Начало */}
          <div className="flex items-center gap-2">
            <GlowingButton
              icon={<Play className="w-4 h-4" />}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                onNavigateCourseContinueHandler(id)
              }}
              isPulseRingEnabled={progress > 0 && progress < 100}
              className="flex-1 px-4 py-2 transition-colors duration-160">
              {progress === 0 && 'Start'}
              {progress === 100 && 'Review'}
              {progress > 0 && progress < 100 && 'Continue'}
            </GlowingButton>

            {progress === 0 && (
              <button className="px-3 py-2 bg-(--secondary) text-(--secondary-foreground) rounded-(--radius) text-sm font-medium hover:bg-(--accent) transition-colors duration-160 focus:outline-none focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 focus:ring-offset-(--card) whitespace-nowrap">
                {'5 min'}
              </button>
            )}

            <button
              className="p-2 hover:bg-(--accent) rounded-(--radius) transition-colors duration-160 focus:outline-none focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 focus:ring-offset-(--card)"
              aria-label="More options">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          {/* Блок действий: Конец */}
        </div>
        {/* Текстовое содержание: Конец */}
      </article>
      {/* Обёртка карточки с hover-анимацией: Конец */}
    </Flex>
    /* Карточка курса: Конец */
  )
}

CourseCard.displayName = 'CourseCard'
