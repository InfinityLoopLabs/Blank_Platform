import type { ComponentProps, ComponentType } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Slider } from '@/components/molecules/Slider'
import {
  buildSliderSlides,
  sliderSlideComponentTypeOptions,
  type SliderSlideComponentType,
} from '@/components/molecules/Slider/slides'

type SliderStoryPropertyType = ComponentProps<typeof Slider> & {
  componentType: SliderSlideComponentType
  isEditModeEnabled: boolean
  isEditModeDisabled: boolean
  onTagClick: (id: string) => void
  onTagLabelChange: (id: string, value: string) => void
}

const meta = {
  title: 'Molecules/Slider',
  component: Slider as unknown as ComponentType<SliderStoryPropertyType>,
  tags: ['autodocs'],
  render: ({
    componentType,
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange,
    ...sliderProperty
  }: SliderStoryPropertyType) => {
    const slides = buildSliderSlides({
      componentType,
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange,
    })

    return (
      <div className="mx-auto w-[760px] max-w-full px-10">
        <Slider {...sliderProperty} slides={slides} />
      </div>
    )
  },
  decorators: [
    Story => (
      <div className="w-full p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    slides: [],
    componentType: 'MediumVerticalSlide',
    isEditModeEnabled: false,
    isEditModeDisabled: false,
    onTagClick: fn(),
    onTagLabelChange: fn(),
    slidesPerView: 'auto',
    spaceBetween: 16,
    isLoopEnabled: false,
    isPaginationVisible: true,
    isNavigationEnabled: true,
    isArrowsVisible: true,
    isMousewheelEnabled: true,
    isKeyboardEnabled: true,
    isGrabCursorVisible: true,
    isFreeScrollEnabled: true,
    onSlideChange: fn(),
  },
  argTypes: {
    slides: {
      table: { disable: true },
    },
    componentType: {
      control: 'select',
      options: sliderSlideComponentTypeOptions,
    },
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
    onSlideChange: {
      table: { disable: true },
    },
    slidesPerView: {
      table: { disable: true },
    },
    spaceBetween: {
      control: {
        type: 'number',
        min: 0,
        max: 48,
        step: 2,
      },
    },
    isLoopEnabled: {
      control: 'boolean',
    },
    isPaginationVisible: {
      control: 'boolean',
    },
    isNavigationEnabled: {
      control: 'boolean',
    },
    isArrowsVisible: {
      control: 'boolean',
    },
    isMousewheelEnabled: {
      control: 'boolean',
    },
    isKeyboardEnabled: {
      control: 'boolean',
    },
    isGrabCursorVisible: {
      control: 'boolean',
    },
    isFreeScrollEnabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<SliderStoryPropertyType>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
