import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Swiper as SwiperType } from 'swiper'
import {
  A11y,
  FreeMode,
  Keyboard,
  Mousewheel,
  Pagination,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/pagination'

export type Slider2PropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: React.ReactNode
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  isLoopEnabled?: boolean
  isPaginationVisible?: boolean
  isNavigationEnabled?: boolean
  isArrowsVisible?: boolean
  isMousewheelEnabled?: boolean
  isKeyboardEnabled?: boolean
  isGrabCursorVisible?: boolean
  isFreeScrollEnabled?: boolean
  onSlideChange?: (activeSlideIndex: number) => void
}

export const Slider2 = ({
  children,
  className,
  slidesPerView = 1,
  spaceBetween = 16,
  isLoopEnabled = false,
  isPaginationVisible = true,
  isNavigationEnabled = true,
  isArrowsVisible = true,
  isMousewheelEnabled = true,
  isKeyboardEnabled = true,
  isGrabCursorVisible = true,
  isFreeScrollEnabled = false,
  onSlideChange,
  ...property
}: Slider2PropertyType) => {
  const slides = React.useMemo(
    () => React.Children.toArray(children),
    [children],
  )
  const slidesCount = slides.length
  const isAutoSlidesPerView = slidesPerView === 'auto'
  const isLoopRequested = isLoopEnabled && slidesCount > 1
  const isLoopResolvedEnabled =
    isLoopRequested && !isFreeScrollEnabled && !isAutoSlidesPerView
  const isRewindResolvedEnabled = isLoopRequested && !isLoopResolvedEnabled
  const isArrowsResolvedVisible = isNavigationEnabled && isArrowsVisible
  const isArrowsDisabled = slidesCount <= 1
  const swiperReference = React.useRef<SwiperType | null>(null)

  const handleSlideChange = (swiper: SwiperType) => {
    onSlideChange?.(swiper.realIndex)
  }

  return (
    <div
      className={cn('relative w-full min-w-0 max-w-full', className)}
      {...property}>
      <Swiper
        modules={[A11y, FreeMode, Keyboard, Mousewheel, Pagination]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={isLoopResolvedEnabled}
        rewind={isRewindResolvedEnabled}
        loopAdditionalSlides={isLoopResolvedEnabled ? slidesCount : undefined}
        watchSlidesProgress={isLoopResolvedEnabled}
        pagination={isPaginationVisible ? { clickable: true } : false}
        keyboard={isKeyboardEnabled ? { enabled: true } : false}
        freeMode={
          isFreeScrollEnabled
            ? {
                enabled: true,
                sticky: false,
                momentum: true,
                momentumBounce: true,
              }
            : false
        }
        mousewheel={
          isMousewheelEnabled
            ? {
                enabled: true,
                forceToAxis: false,
                releaseOnEdges: !isLoopResolvedEnabled,
                sensitivity: 0.9,
              }
            : false
        }
        allowTouchMove
        grabCursor={isGrabCursorVisible}
        simulateTouch
        className={cn(
          'w-full min-w-0 max-w-full [--swiper-theme-color:var(--chart-1)]',
          '[&_.swiper-pagination-bullet]:bg-(--chart-1)',
          '[&_.swiper-pagination-bullet]:opacity-45',
          '[&_.swiper-pagination-bullet-active]:bg-(--chart-1)',
          '[&_.swiper-pagination-bullet-active]:opacity-100',
        )}
        onSwiper={swiper => {
          swiperReference.current = swiper
        }}
        onSlideChange={handleSlideChange}>
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className={cn('h-auto', isAutoSlidesPerView && '!w-auto')}>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>

      {isArrowsResolvedVisible ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            disabled={isArrowsDisabled}
            onClick={() => swiperReference.current?.slidePrev()}
            className={cn(
              'absolute top-1/2 left-3 z-20 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-md border',
              'border-border/80 bg-background/70 text-foreground backdrop-blur-sm',
              'transition duration-200 hover:bg-background/90',
              'disabled:cursor-not-allowed disabled:opacity-35',
            )}>
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={isArrowsDisabled}
            onClick={() => swiperReference.current?.slideNext()}
            className={cn(
              'absolute top-1/2 right-3 z-20 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-md border',
              'border-border/80 bg-background/70 text-foreground backdrop-blur-sm',
              'transition duration-200 hover:bg-background/90',
              'disabled:cursor-not-allowed disabled:opacity-35',
            )}>
            <ChevronRight className="size-4" />
          </button>
        </>
      ) : null}
    </div>
  )
}
