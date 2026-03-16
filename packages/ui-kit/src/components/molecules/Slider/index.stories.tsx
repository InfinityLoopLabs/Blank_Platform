import type { ComponentProps, ComponentType } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Paper } from '@/components/atoms/Paper'
import { Typography } from '@/components/atoms/Typography'
import { Slider } from '@/components/molecules/Slider'
import {
  StoreSlide,
  type StoreSlideTagItemType,
} from '@/components/molecules/SlideTemplates'

const courseSlideData = [
  {
    id: 'react',
    coverImageSrc: 'https://picsum.photos/seed/react-course/1300/780',
    brandName: 'Frontend Track',
    heading: 'React: от компонентов до production',
    accentText: 'Hooks, Router, state management и архитектура UI',
    description: 'Практический курс по разработке интерфейсов и оптимизации React-приложений.',
    priceText: 'от 4 990 ₽',
    tagText: 'Курс',
  },
  {
    id: 'go',
    coverImageSrc: 'https://picsum.photos/seed/go-course/1300/780',
    brandName: 'Backend Track',
    heading: 'Go: высоконагруженные backend-сервисы',
    accentText: 'Горутины, каналы, API и тестирование',
    description: 'Курс по построению микросервисов на Go с акцентом на производительность и надежность.',
    priceText: 'от 5 490 ₽',
    tagText: 'Курс',
  },
  {
    id: 'k8s',
    coverImageSrc: 'https://picsum.photos/seed/k8s-course/1300/780',
    brandName: 'DevOps Track',
    heading: 'Kubernetes: оркестрация в реальных проектах',
    accentText: 'Deployments, ingress, autoscaling, Helm',
    description: 'Освойте запуск, масштабирование и сопровождение контейнеризированных приложений в Kubernetes.',
    priceText: 'от 6 990 ₽',
    tagText: 'Курс',
  },
  {
    id: 'redis',
    coverImageSrc: 'https://picsum.photos/seed/redis-course/1300/780',
    brandName: 'Data Track',
    heading: 'Redis: кэширование, очереди и pub/sub',
    accentText: 'TTL, eviction policies и low-latency паттерны',
    description: 'Научитесь использовать Redis для ускорения приложений и обработки событий в реальном времени.',
    priceText: 'от 4 490 ₽',
    tagText: 'Курс',
  },
  {
    id: 'postgresql',
    coverImageSrc: 'https://picsum.photos/seed/postgres-course/1300/780',
    brandName: 'Database Track',
    heading: 'PostgreSQL: моделирование и оптимизация SQL',
    accentText: 'Индексы, транзакции, explain analyze, миграции',
    description: 'Курс по проектированию схем и ускорению запросов в PostgreSQL для продуктовых систем.',
    priceText: 'от 5 290 ₽',
    tagText: 'Курс',
  },
  {
    id: 'kafka',
    coverImageSrc: 'https://picsum.photos/seed/kafka-course/1300/780',
    brandName: 'Streaming Track',
    heading: 'Kafka: event-driven архитектура',
    accentText: 'Topics, partitions, consumer groups',
    description: 'Разберете обработку потоков данных, гарантии доставки и построение event-driven платформ.',
    priceText: 'от 6 190 ₽',
    tagText: 'Курс',
  },
]

const componentTypeOptions = [
  'MediumVerticalSlide',
  'MeduimHorizontalSlie',
] as const
type SlideComponentType = (typeof componentTypeOptions)[number]
const mediumVerticalSlideWidthClassName = 'w-[460px] min-w-[460px]'
const meduimHorizontalSlideWidthClassName = 'w-[520px] min-w-[520px]'

type SliderStoryPropertyType = ComponentProps<typeof Slider> & {
  componentType: SlideComponentType
  isEditModeEnabled: boolean
  isEditModeDisabled: boolean
  onTagClick: (id: string) => void
  onTagLabelChange: (id: string, value: string) => void
}

const getTagsByVariant = (
  variant: 'no-tags' | 'one-tag' | 'two-tags' | 'two-other-tags',
  slideId: string,
  baseLabel: string,
): { tags: StoreSlideTagItemType[]; tagText?: string } => {
  if (variant === 'no-tags') {
    return {
      tags: [],
      tagText: undefined,
    }
  }

  if (variant === 'one-tag') {
    return {
      tags: [
        {
          id: `course-${slideId}`,
          label: baseLabel,
          type: 'default',
        },
      ],
    }
  }

  if (variant === 'two-tags') {
    return {
      tags: [
        {
          id: `course-${slideId}`,
          label: baseLabel,
          type: 'default',
        },
        {
          id: `time-${slideId}`,
          label: '2:13',
          type: 'time',
          position: 'bottom-right',
        },
      ],
    }
  }

  return {
    tags: [
      {
        id: `hot-${slideId}`,
        label: 'HOT',
        type: 'default',
        color: 'chart-1',
      },
      {
        id: `level-${slideId}`,
        label: 'PRO',
        type: 'time',
        color: 'chart-3',
        textColor: 'foreground',
        position: 'bottom-right',
      },
    ],
  }
}

const MeduimHorizontalSlie = ({
  coverImageSrc,
  brandName,
  heading,
  viewsText,
}: {
  coverImageSrc: string
  brandName: string
  heading: string
  viewsText: string
}) => (
  <Paper
    type="gradient"
    isRoundedCornersDisabled
    className="flex h-[360px] w-full flex-col gap-3 border-0 p-2">
    <div className="h-[220px] w-full overflow-hidden rounded-lg">
      <img
        src={coverImageSrc}
        alt={heading}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>

    <div className="flex flex-col gap-1 px-1 pb-1">
      <Typography
        typography="Action"
        element="p"
        className="font-semibold uppercase tracking-wide">
        {brandName}
      </Typography>
      <Typography
        typography="SectionHeader"
        element="h3"
        className="overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
        {heading}
      </Typography>
      <Typography
        typography="BodySmall"
        element="p"
        color="muted-foreground"
        className="pt-1">
        {viewsText}
      </Typography>
    </div>
  </Paper>
)

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
    const slides =
      componentType === 'MediumVerticalSlide'
        ? courseSlideData.slice(0, 4).map((slide, index) => {
            const mixedVariantByIndex = [
              'no-tags',
              'two-tags',
              'one-tag',
              'two-other-tags',
            ] as const
            const { tags, tagText } = getTagsByVariant(
              mixedVariantByIndex[index] ?? 'one-tag',
              slide.id,
              slide.tagText ?? 'Курс',
            )

            return (
              <div
                key={slide.id}
                className={mediumVerticalSlideWidthClassName}>
                <StoreSlide
                  {...slide}
                  tagText={tagText}
                  tags={tags}
                  isEditModeEnabled={isEditModeEnabled}
                  isEditModeDisabled={isEditModeDisabled}
                  onTagClick={onTagClick}
                  onTagLabelChange={onTagLabelChange}
                />
              </div>
            )
          })
        : courseSlideData.slice(0, 4).map(slide => (
            <div
              key={`preview-${slide.id}`}
              className={meduimHorizontalSlideWidthClassName}>
              <MeduimHorizontalSlie
                coverImageSrc={slide.coverImageSrc}
                brandName={slide.brandName}
                heading={slide.heading}
                viewsText="661 просмотры"
              />
            </div>
          ))

    return <Slider {...sliderProperty} slides={slides} />
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
    isFreeScrollEnabled: false,
    onSlideChange: fn(),
  },
  argTypes: {
    slides: {
      table: { disable: true },
    },
    componentType: {
      control: 'select',
      options: componentTypeOptions,
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
