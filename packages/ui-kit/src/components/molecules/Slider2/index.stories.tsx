import type { ComponentProps, ComponentType } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import {
  buildSliderSlides,
  sliderSlideComponentTypeOptions,
  type SliderSlideComponentType,
} from '@/components/molecules/Slider/slides'
import { Slider2 } from '@/components/molecules/Slider2'

type Slider2StoryPropertyType = ComponentProps<typeof Slider2> & {
  componentType: SliderSlideComponentType
  isEditModeEnabled: boolean
  isEditModeDisabled: boolean
  onTagClick: (id: string) => void
  onTagLabelChange: (id: string, value: string) => void
}

const meta = {
  title: 'Molecules/Slider 2',
  component: Slider2 as unknown as ComponentType<Slider2StoryPropertyType>,
  tags: ['autodocs'],
  render: ({
    componentType,
    isEditModeEnabled,
    isEditModeDisabled,
    onTagClick,
    onTagLabelChange,
    ...sliderProperty
  }: Slider2StoryPropertyType) => {
    const slides = buildSliderSlides({
      componentType,
      isEditModeEnabled,
      isEditModeDisabled,
      onTagClick,
      onTagLabelChange,
    })

    return (
      <div className="w-[760px] max-w-full">
        <Slider2 {...sliderProperty}>{slides}</Slider2>
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
    isFreeScrollEnabled: false,
    onSlideChange: fn(),
    children: null,
  },
  argTypes: {
    children: {
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
} satisfies Meta<Slider2StoryPropertyType>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
