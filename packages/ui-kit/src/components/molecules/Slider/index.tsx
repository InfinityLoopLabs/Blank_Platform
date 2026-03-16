import * as React from 'react'

import type { Swiper as SwiperType } from 'swiper'
import {
  A11y,
  FreeMode,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type SliderPropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  slides: React.ReactNode[]
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
  onSlideChange?: (activeSlideIndex: number) => void
}

export const Slider = ({
  slides,
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
  isFreeScrollEnabled = false,
  onSlideChange,
  ...property
}: SliderPropertyType) => {
  const isNavigationResolvedEnabled =
    isNavigationEnabled ?? isNavigationVisible ?? true

  const handleSlideChange = (swiper: SwiperType) => {
    onSlideChange?.(swiper.realIndex)
  }

  return (
    <div className={cn('relative w-full', className)} {...property}>
      <Swiper
        modules={[A11y, FreeMode, Keyboard, Mousewheel, Navigation, Pagination]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={isLoopEnabled}
        navigation={isNavigationResolvedEnabled && isArrowsVisible}
        pagination={isPaginationVisible ? { clickable: true } : false}
        keyboard={isKeyboardEnabled ? { enabled: true } : false}
        freeMode={
          isFreeScrollEnabled
            ? {
                enabled: true,
                sticky: false,
                momentum: false,
                momentumBounce: false,
              }
            : false
        }
        mousewheel={
          isMousewheelEnabled
            ? {
                forceToAxis: true,
                releaseOnEdges: true,
                sensitivity: 0.85,
              }
            : false
        }
        grabCursor={isGrabCursorVisible}
        simulateTouch
        className={cn(
          'w-full [--swiper-theme-color:var(--chart-1)]',
          '[&_.swiper-button-next]:text-(--chart-1) [&_.swiper-button-prev]:text-(--chart-1)',
          '[&_.swiper-pagination-bullet]:bg-(--chart-1)',
          '[&_.swiper-pagination-bullet]:opacity-45',
          '[&_.swiper-pagination-bullet-active]:bg-(--chart-1)',
          '[&_.swiper-pagination-bullet-active]:opacity-100',
        )}
        onSlideChange={handleSlideChange}>
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="h-auto">
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
