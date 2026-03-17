import * as React from 'react'

import { BigHorizontalSlide } from './BigHorizontalSlide'
import { MediumHorizontalSlide } from './MediumHorizontalSlide'
import { MediumVerticalSlide } from './MediumVerticalSlide'
import type { StoreSlideTagItemType } from '@/components/molecules/SlideTemplates'

export type SliderDemoSlideItemType = {
  id: string
  coverImageSrc: string
  brandName: string
  heading: string
  accentText: string
  description: string
  priceText: string
  tagText: string
}

export const courseSlideData: SliderDemoSlideItemType[] = [
  {
    id: 'react',
    coverImageSrc: 'https://picsum.photos/seed/react-course/1300/780',
    brandName: 'Frontend Track',
    heading: 'React: от компонентов до production',
    accentText: 'Hooks, Router, state management и архитектура UI',
    description:
      'Практический курс по разработке интерфейсов и оптимизации React-приложений.',
    priceText: 'от 4 990 ₽',
    tagText: 'Курс',
  },
  {
    id: 'go',
    coverImageSrc: 'https://picsum.photos/seed/go-course/1300/780',
    brandName: 'Backend Track',
    heading: 'Go: высоконагруженные backend-сервисы',
    accentText: 'Горутины, каналы, API и тестирование',
    description:
      'Курс по построению микросервисов на Go с акцентом на производительность и надежность.',
    priceText: 'от 5 490 ₽',
    tagText: 'Курс',
  },
  {
    id: 'k8s',
    coverImageSrc: 'https://picsum.photos/seed/k8s-course/1300/780',
    brandName: 'DevOps Track',
    heading: 'Kubernetes: оркестрация в реальных проектах',
    accentText: 'Deployments, ingress, autoscaling, Helm',
    description:
      'Освойте запуск, масштабирование и сопровождение контейнеризированных приложений в Kubernetes.',
    priceText: 'от 6 990 ₽',
    tagText: 'Курс',
  },
  {
    id: 'redis',
    coverImageSrc: 'https://picsum.photos/seed/redis-course/1300/780',
    brandName: 'Data Track',
    heading: 'Redis: кэширование, очереди и pub/sub',
    accentText: 'TTL, eviction policies и low-latency паттерны',
    description:
      'Научитесь использовать Redis для ускорения приложений и обработки событий в реальном времени.',
    priceText: 'от 4 490 ₽',
    tagText: 'Курс',
  },
  {
    id: 'postgresql',
    coverImageSrc: 'https://picsum.photos/seed/postgres-course/1300/780',
    brandName: 'Database Track',
    heading: 'PostgreSQL: моделирование и оптимизация SQL',
    accentText: 'Индексы, транзакции, explain analyze, миграции',
    description:
      'Курс по проектированию схем и ускорению запросов в PostgreSQL для продуктовых систем.',
    priceText: 'от 5 290 ₽',
    tagText: 'Курс',
  },
  {
    id: 'kafka',
    coverImageSrc: 'https://picsum.photos/seed/kafka-course/1300/780',
    brandName: 'Streaming Track',
    heading: 'Kafka: event-driven архитектура',
    accentText: 'Topics, partitions, consumer groups',
    description:
      'Разберете обработку потоков данных, гарантии доставки и построение event-driven платформ.',
    priceText: 'от 6 190 ₽',
    tagText: 'Курс',
  },
]

export const sliderSlideComponentTypeOptions = [
  'MediumVerticalSlide',
  'MediumHorizontalSlide',
  'BigHorizontalSlide',
] as const

export type SliderSlideComponentType =
  (typeof sliderSlideComponentTypeOptions)[number]

export const mediumVerticalSlideWidthClassName = 'w-[460px] min-w-[460px]'
export const mediumHorizontalSlideWidthClassName = 'w-[520px] min-w-[520px]'
export const bigHorizontalSlideWidthClassName = 'w-[620px] min-w-[620px]'

type TagVariantType = 'no-tags' | 'one-tag' | 'two-tags' | 'two-other-tags'

export const getTagsByVariant = (
  variant: TagVariantType,
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

export type BuildSliderSlidesPropertyType = {
  componentType: SliderSlideComponentType
  isEditModeEnabled?: boolean
  isEditModeDisabled?: boolean
  onTagClick?: (id: string) => void
  onTagLabelChange?: (id: string, value: string) => void
}

export const buildSliderSlides = ({
  componentType,
  isEditModeEnabled = false,
  isEditModeDisabled = false,
  onTagClick,
  onTagLabelChange,
}: BuildSliderSlidesPropertyType): React.ReactNode[] => {
  if (componentType === 'MediumVerticalSlide') {
    const mixedVariantByIndex = [
      'no-tags',
      'two-tags',
      'one-tag',
      'two-other-tags',
    ] as const

    return courseSlideData.slice(0, 4).map((slide, index) => {
      const { tags, tagText } = getTagsByVariant(
        mixedVariantByIndex[index] ?? 'one-tag',
        slide.id,
        slide.tagText ?? 'Курс',
      )

      return (
        <div key={slide.id} className={mediumVerticalSlideWidthClassName}>
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
      )
    })
  }

  if (componentType === 'BigHorizontalSlide') {
    const mixedVariantByIndex = [
      'two-tags',
      'one-tag',
      'two-other-tags',
    ] as const

    return courseSlideData.slice(0, 3).map((slide, index) => {
      const { tags, tagText } = getTagsByVariant(
        mixedVariantByIndex[index] ?? 'one-tag',
        slide.id,
        slide.tagText ?? 'Курс',
      )

      return (
        <div
          key={`big-${slide.id}`}
          className={bigHorizontalSlideWidthClassName}>
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
      )
    })
  }

  return courseSlideData.slice(0, 4).map(slide => (
    <div
      key={`preview-${slide.id}`}
      className={mediumHorizontalSlideWidthClassName}>
      <MediumHorizontalSlide
        coverImageSrc={slide.coverImageSrc}
        brandName={slide.brandName}
        heading={slide.heading}
        viewsText="661 просмотры"
        tagText={slide.id === 'react' ? 'NEW' : undefined}
        isEditModeEnabled={isEditModeEnabled}
        isEditModeDisabled={isEditModeDisabled}
      />
    </div>
  ))
}
