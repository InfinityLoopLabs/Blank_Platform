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

import { cn } from '../../../lib/utils'

import 'swiper/css'
import 'swiper/css/pagination'

export type SliderPropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  slides?: React.ReactNode[]
  children?: React.ReactNode
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  isLoopEnabled?: boolean
  isPaginationVisible?: boolean
  isNavigationVisible?: boolean
  isNavigationEnabled?: boolean
  isArrowsVisible?: boolean
  isMousewheelEnabled?: boolean
  isKeyboardEnabled?: boolean
  isGrabCursorVisible?: boolean
  isFreeScrollEnabled?: boolean
  activeSlideIndex?: number
  onSlideChange?: (activeSlideIndex: number) => void
}

export const Slider = ({
  slides,
  children,
  className,
  slidesPerView = 1,
  spaceBetween = 16,
  isLoopEnabled = false,
  isPaginationVisible = true,
  isNavigationVisible,
  isNavigationEnabled,
  isArrowsVisible = true,
  isMousewheelEnabled = true,
  isKeyboardEnabled = true,
  isGrabCursorVisible = true,
  isFreeScrollEnabled = true,
  activeSlideIndex,
  onSlideChange,
  style,
  ...property
}: SliderPropertyType) => {
  const resolvedSlides = React.useMemo(
    () => slides ?? React.Children.toArray(children),
    [slides, children],
  )
  const slidesCount = resolvedSlides.length
  const isNavigationResolvedEnabled =
    isNavigationEnabled ?? isNavigationVisible ?? true
  const isArrowsResolvedVisible = isNavigationResolvedEnabled && isArrowsVisible
  const isAutoSlidesPerView = slidesPerView === 'auto'
  const isLoopRequested = isLoopEnabled && slidesCount > 1
  const isLoopResolvedEnabled =
    isLoopRequested && !isFreeScrollEnabled && !isAutoSlidesPerView
  const isRewindResolvedEnabled = isLoopRequested && !isLoopResolvedEnabled
  const isArrowsDisabled = slidesCount <= 1
  const swiperReference = React.useRef<SwiperType | null>(null)
  const lastWheelEventTimestampReference = React.useRef(0)
  const navigationButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    zIndex: 20,
    display: 'flex',
    height: 56,
    width: 32,
    transform: 'translateY(-50%)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    border: '1px solid rgba(148, 163, 184, 0.45)',
    background: 'rgba(15, 23, 42, 0.72)',
    color: 'inherit',
    backdropFilter: 'blur(4px)',
    cursor: 'pointer',
    transition: 'background-color 200ms ease, opacity 200ms ease',
  }
  const navigationButtonDisabledStyle: React.CSSProperties = {
    cursor: 'not-allowed',
    opacity: 0.35,
  }

  const handleSlideChange = (swiper: SwiperType) => {
    onSlideChange?.(swiper.realIndex)
  }
  const handleWheelCapture = (event: React.WheelEvent<HTMLDivElement>) => {
    const horizontalDelta = event.deltaX
    const verticalDelta = event.deltaY
    const isHorizontalGesture =
      Math.abs(horizontalDelta) > 4 &&
      Math.abs(horizontalDelta) > Math.abs(verticalDelta) * 1.1

    if (!isHorizontalGesture) {
      return
    }

    // Prevent browser back/forward swipe on trackpads while pointer is over slider.
    if (event.cancelable) {
      event.preventDefault()
    }

    if (!isMousewheelEnabled || isFreeScrollEnabled) {
      return
    }

    const swiper = swiperReference.current
    if (!swiper || slidesCount <= 1) {
      return
    }

    const now = Date.now()
    if (now - lastWheelEventTimestampReference.current < 240) {
      return
    }
    lastWheelEventTimestampReference.current = now

    if (horizontalDelta > 0) {
      swiper.slideNext()
    } else {
      swiper.slidePrev()
    }

  }
  React.useEffect(() => {
    if (typeof activeSlideIndex !== 'number') {
      return
    }

    const swiper = swiperReference.current
    if (!swiper || slidesCount <= 0) {
      return
    }

    const boundedIndex = Math.max(0, Math.min(activeSlideIndex, slidesCount - 1))
    if (swiper.realIndex === boundedIndex) {
      return
    }

    if (isLoopResolvedEnabled) {
      swiper.slideToLoop(boundedIndex)
    } else {
      swiper.slideTo(boundedIndex)
    }
  }, [activeSlideIndex, isLoopResolvedEnabled, slidesCount])
  const activatePreviousSlide = () => {
    if (isArrowsDisabled) {
      return
    }
    swiperReference.current?.slidePrev()
  }
  const activateNextSlide = () => {
    if (isArrowsDisabled) {
      return
    }
    swiperReference.current?.slideNext()
  }
  const handleArrowKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    activate: () => void,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    activate()
  }

  return (
    <div
      className={cn('relative w-full min-w-0 max-w-full', className)}
      style={{ ...style, overscrollBehaviorX: 'contain' }}
      onWheelCapture={handleWheelCapture}
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
                forceToAxis: true,
                releaseOnEdges: !isLoopResolvedEnabled,
                sensitivity: 0.9,
              }
            : false
        }
        allowTouchMove
        grabCursor={isGrabCursorVisible}
        simulateTouch
        touchEventsTarget="container"
        touchStartPreventDefault={false}
        touchMoveStopPropagation={false}
        className={cn(
          'w-full min-w-0 max-w-full [--swiper-theme-color:var(--chart-1)]',
          '[&_.swiper-pagination-bullet]:bg-(--chart-1)',
          '[&_.swiper-pagination-bullet]:opacity-45',
          '[&_.swiper-pagination-bullet-active]:bg-(--chart-1)',
          '[&_.swiper-pagination-bullet-active]:opacity-100',
          isGrabCursorVisible && 'cursor-grab active:cursor-grabbing',
        )}
        onSwiper={swiper => {
          swiperReference.current = swiper
        }}
        onSlideChange={handleSlideChange}>
        {resolvedSlides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className={cn('h-auto', isAutoSlidesPerView && '!w-auto')}>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>

      {isArrowsResolvedVisible ? (
        <>
          <div
            role="button"
            aria-label="Previous slide"
            aria-disabled={isArrowsDisabled}
            tabIndex={isArrowsDisabled ? -1 : 0}
            onClick={activatePreviousSlide}
            onKeyDown={event => handleArrowKeyDown(event, activatePreviousSlide)}
            style={{
              ...navigationButtonStyle,
              left: -40,
              ...(isArrowsDisabled ? navigationButtonDisabledStyle : null),
            }}
            className={cn(
              'absolute top-1/2 -left-10 z-20 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-md border',
              'border-border/80 bg-background/70 text-foreground backdrop-blur-sm',
              'transition duration-200 hover:bg-background/90',
              'disabled:cursor-not-allowed disabled:opacity-35',
            )}>
            <ChevronLeft className="size-4" />
          </div>
          <div
            role="button"
            aria-label="Next slide"
            aria-disabled={isArrowsDisabled}
            tabIndex={isArrowsDisabled ? -1 : 0}
            onClick={activateNextSlide}
            onKeyDown={event => handleArrowKeyDown(event, activateNextSlide)}
            style={{
              ...navigationButtonStyle,
              right: -40,
              ...(isArrowsDisabled ? navigationButtonDisabledStyle : null),
            }}
            className={cn(
              'absolute top-1/2 -right-10 z-20 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-md border',
              'border-border/80 bg-background/70 text-foreground backdrop-blur-sm',
              'transition duration-200 hover:bg-background/90',
              'disabled:cursor-not-allowed disabled:opacity-35',
            )}>
            <ChevronRight className="size-4" />
          </div>
        </>
      ) : null}
    </div>
  )
}
