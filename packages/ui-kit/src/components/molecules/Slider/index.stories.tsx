import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Slider } from '@/components/molecules/Slider'
import { StoreSlide } from '@/components/molecules/SlideTemplates'

const demoSlides = [
  {
    id: 'diablo4',
    isSetModeEnabled: true,
    coverImageSrc: 'https://picsum.photos/seed/diablo4/1300/780',
    brandName: 'Diablo IV',
    heading: 'Diablo IV: Lord of Hatred — издание Ultimate',
    accentText: 'Оформите предзаказ и получите ранний доступ',
    description: 'Action-RPG (ролевая игра в жанре экшен)',
    priceText: '3 599,00 TRY',
    tagText: 'Предзаказ',
  },
  {
    id: 'immortal',
    coverImageSrc: 'https://picsum.photos/seed/immortal/1300/780',
    brandName: 'Diablo Immortal',
    heading: 'Комплект из 7200 вечных сфер',
    accentText: 'Внутриигровой контент',
    description: 'Набор валюты для покупки боевого пропуска и предметов',
    priceText: '3 399,99 TRY',
  },
  {
    id: 'cod',
    coverImageSrc: 'https://picsum.photos/seed/cod-bo7/1300/780',
    brandName: 'Call of Duty Black Ops 7',
    heading: 'Call of Duty: Black Ops 7',
    accentText: 'Собирайте трофеи и выживайте в сезоне 02',
    description: 'Шутер',
    priceText: '3 199,00 TRY',
  },
  {
    id: 'ow',
    coverImageSrc: 'https://picsum.photos/seed/overwatch/1300/780',
    brandName: 'Overwatch',
    heading: 'Overwatch — монеты Overwatch',
    accentText: 'Используйте монеты для покупки премиального контента',
    description: 'Призмы и монеты',
    priceText: 'От 179,99 TRY',
  },
].map(slide => <StoreSlide key={slide.id} {...slide} />)

const meta = {
  title: 'Molecules/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[680px] p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    slides: demoSlides,
    slidesPerView: 1,
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
  },
  argTypes: {
    slides: {
      table: { disable: true },
    },
    onSlideChange: {
      table: { disable: true },
    },
    slidesPerView: {
      control: {
        type: 'number',
        min: 1,
        max: 4,
        step: 1,
      },
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
} satisfies Meta<typeof Slider>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
