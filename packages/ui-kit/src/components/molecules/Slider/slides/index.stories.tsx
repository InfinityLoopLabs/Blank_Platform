import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Slider } from '@/components/molecules/Slider'
import {
  bigHorizontalSlideWidthStyle,
  BigHorizontalSlide,
  buildSliderSlides,
  courseSlideData,
  getTagsByVariant,
  MediumHorizontalSlide,
  MediumVerticalSlide,
  mediumHorizontalSlideWidthStyle,
  mediumVerticalSlideWidthStyle,
} from '@/components/molecules/Slider/slides'

type SlideStoryPropertyType = {
  isEditModeEnabled: boolean
  isEditModeDisabled: boolean
  onTagClick: (id: string) => void
  onTagLabelChange: (id: string, value: string) => void
}

const sliderDocsContainerClassName = 'mx-auto w-[760px] max-w-full px-10'

const meta: Meta<SlideStoryPropertyType> = {
  title: 'Molecules/Slider/Slides',
  tags: ['autodocs'],
  args: {
    isEditModeEnabled: false,
    isEditModeDisabled: false,
    onTagClick: fn(),
    onTagLabelChange: fn(),
  },
  argTypes: {
    isEditModeEnabled: {
      control: 'boolean',
    },
    isEditModeDisabled: {
      control: 'boolean',
    },
    onTagClick: {
      table: { disable: true },
    },
    onTagLabelChange: {
      table: { disable: true },
    },
  },
}

export default meta

type StoryType = StoryObj<SlideStoryPropertyType>

export const MediumVerticalExample: StoryType = {
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange,
  }) => {
    const slide = courseSlideData[0]
    const { tags, tagText } = getTagsByVariant(
      'two-tags',
      slide.id,
      slide.tagText,
    )

    return (
      <div className="w-full p-4">
        <div className={sliderDocsContainerClassName}>
          <div style={mediumVerticalSlideWidthStyle}>
            <MediumVerticalSlide
              {...slide}
              tagText={tagText}
              tags={tags}
              isEditModeEnabled={isEditModeEnabled}
              isEditModeDisabled={isEditModeDisabled}
              onTagClick={onTagClick}
              onTagLabelChange={onTagLabelChange}
            />
          </div>
        </div>
      </div>
    )
  },
}

export const MediumHorizontalExample: StoryType = {
  render: ({ isEditModeEnabled, isEditModeDisabled }) => {
    const slide = courseSlideData[0]

    return (
      <div className="w-full p-4">
        <div className={sliderDocsContainerClassName}>
          <div style={mediumHorizontalSlideWidthStyle}>
            <MediumHorizontalSlide
              coverImageSrc={slide.coverImageSrc}
              brandName={slide.brandName}
              heading={slide.heading}
              viewsText="661 просмотры"
              tagText="NEW"
              isEditModeEnabled={isEditModeEnabled}
              isEditModeDisabled={isEditModeDisabled}
            />
          </div>
        </div>
      </div>
    )
  },
}

export const BigHorizontalExample: StoryType = {
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange,
  }) => {
    const slide = courseSlideData[0]
    const { tags, tagText } = getTagsByVariant(
      'two-other-tags',
      slide.id,
      slide.tagText,
    )

    return (
      <div className="w-full p-4">
        <div className={sliderDocsContainerClassName}>
          <div style={bigHorizontalSlideWidthStyle}>
            <BigHorizontalSlide
              coverImageSrc={slide.coverImageSrc}
              brandName={slide.brandName}
              heading={slide.heading}
              description={slide.description}
              tagText={tagText}
              tags={tags}
              isEditModeEnabled={isEditModeEnabled}
              isEditModeDisabled={isEditModeDisabled}
              onTagClick={onTagClick}
              onTagLabelChange={onTagLabelChange}
            />
          </div>
        </div>
      </div>
    )
  },
}

export const MediumVerticalInSlider: StoryType = {
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange,
  }) => {
    const slides = buildSliderSlides({
      componentType: 'MediumVerticalSlide',
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange,
    })

    return (
      <div className="w-full p-4">
        <div className={sliderDocsContainerClassName}>
          <Slider
            slides={slides}
            slidesPerView="auto"
            spaceBetween={16}
            isLoopEnabled={false}
            isPaginationVisible
            isNavigationEnabled
            isArrowsVisible
            isMousewheelEnabled
            isKeyboardEnabled
            isGrabCursorVisible
            isFreeScrollEnabled
          />
        </div>
      </div>
    )
  },
}

export const BigHorizontalInSlider: StoryType = {
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange,
  }) => {
    const slides = buildSliderSlides({
      componentType: 'BigHorizontalSlide',
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange,
    })

    return (
      <div className="w-full p-4">
        <div className={sliderDocsContainerClassName}>
          <Slider
            slides={slides}
            slidesPerView="auto"
            spaceBetween={16}
            isLoopEnabled={false}
            isPaginationVisible
            isNavigationEnabled
            isArrowsVisible
            isMousewheelEnabled
            isKeyboardEnabled
            isGrabCursorVisible
            isFreeScrollEnabled
          />
        </div>
      </div>
    )
  },
}

export const MediumHorizontalInSlider: StoryType = {
  render: ({
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange,
  }) => {
    const slides = buildSliderSlides({
      componentType: 'MediumHorizontalSlide',
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange,
    })

    return (
      <div className="w-full p-4">
        <div className={sliderDocsContainerClassName}>
          <Slider
            slides={slides}
            slidesPerView="auto"
            spaceBetween={16}
            isLoopEnabled={false}
            isPaginationVisible
            isNavigationEnabled
            isArrowsVisible
            isMousewheelEnabled
            isKeyboardEnabled
            isGrabCursorVisible
            isFreeScrollEnabled
          />
        </div>
      </div>
    )
  },
}
