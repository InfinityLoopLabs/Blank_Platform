import type { ComponentProps } from 'react'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import {
  Image,
  IMAGE_MASK_OPTIONS,
  IMAGE_SIDE_SHADE_SIDE_OPTIONS,
} from '@/components/atoms/Image'
import { Paper } from '@/components/atoms/Paper'
import { TYPOGRAPHY_COLOR_OPTIONS } from '@/components/atoms/Typography'
import { cn } from '@/lib/utils'

const mockImageUrl =
  'https://ideogram.ai/assets/image/balanced/response/5vFcpmLUSSa_BwrhU4WiGQ@2k'

const maskTypeControlLabels = Object.fromEntries(
  IMAGE_MASK_OPTIONS.map(option => [option.value, option.label]),
)
const sideShadeSideControlLabels = Object.fromEntries(
  IMAGE_SIDE_SHADE_SIDE_OPTIONS.map(option => [option, option]),
)

const previewFormatOptions = [
  {
    value: 'horizontal',
    label: 'Horizontal (1920 x 1080)',
  },
  {
    value: 'vertical',
    label: 'Vertical (1080 x 1920)',
  },
  {
    value: 'square',
    label: 'Square (1080 x 1080)',
  },
] as const

type PreviewFormatType = (typeof previewFormatOptions)[number]['value']

const previewFormatControlLabels = Object.fromEntries(
  previewFormatOptions.map(option => [option.value, option.label]),
)

const previewFormatClassNameDictionary: Record<PreviewFormatType, string> = {
  horizontal: 'w-[72%] aspect-[16/9]',
  vertical: 'w-[42%] aspect-[9/16]',
  square: 'w-[56%] aspect-square',
}

type StoryArgsType = ComponentProps<typeof Image> & {
  previewFormat: PreviewFormatType
}

const meta = {
  title: 'Atoms/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    controls: {
      sort: 'none',
    },
  },
  decorators: [
    Story => (
      <Paper type="dark" className="inline-flex p-6">
        <Story />
      </Paper>
    ),
  ],
  render: args => {
    const { previewFormat, ...imageArgs } = args
    const [{ cropPositionValue }, updateArgs] = useArgs()

    return (
      <div className="flex justify-center">
        <Image
          {...imageArgs}
          cropPositionValue={cropPositionValue}
          onCropPositionChange={nextValue =>
            updateArgs({ cropPositionValue: nextValue })
          }
          className={cn(
            'border border-(--border)',
            previewFormatClassNameDictionary[previewFormat],
          )}
        />
      </div>
    )
  },
  args: {
    maskType: 0,
    previewFormat: 'square',
    isEditModeDisabled: false,
    isSquareCrop: false,
    cropX: 50,
    cropY: 50,
    cropPositionValue: {
      x: 50,
      y: 50,
    },
    imagePosition: undefined,
    maskSize: '100% 100%',
    maskPositionValue: {
      x: 50,
      y: 50,
    },
    maskFillColor: undefined,
    maskStrokeColor: undefined,
    maskStrokeWidth: 1,
    isTopShadeVisible: false,
    topShadeColor: undefined,
    isBottomShadeVisible: false,
    bottomShadeColor: undefined,
    isSideShadeVisible: false,
    sideShadeSide: 'right',
    sideShadeColorToken: 'background',
    src: mockImageUrl,
  },
  argTypes: {
    maskType: {
      control: {
        type: 'select',
        labels: maskTypeControlLabels,
      },
      options: IMAGE_MASK_OPTIONS.map(option => option.value),
    },
    previewFormat: {
      control: {
        type: 'select',
        labels: previewFormatControlLabels,
      },
      options: previewFormatOptions.map(option => option.value),
    },
    isEditModeDisabled: {
      control: 'boolean',
    },
    isSquareCrop: {
      control: 'boolean',
    },
    cropX: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    cropY: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    imagePosition: {
      control: 'text',
    },
    cropPositionValue: {
      control: 'object',
    },
    defaultCropPositionValue: {
      control: 'object',
    },
    maskPositionValue: {
      control: 'object',
    },
    maskSize: {
      control: 'text',
    },
    maskFillColor: {
      control: 'color',
    },
    maskStrokeColor: {
      control: 'color',
    },
    maskStrokeWidth: {
      control: {
        type: 'range',
        min: 0,
        max: 24,
        step: 0.5,
      },
    },
    isTopShadeVisible: {
      control: 'boolean',
    },
    topShadeColor: {
      control: 'color',
    },
    isBottomShadeVisible: {
      control: 'boolean',
    },
    bottomShadeColor: {
      control: 'color',
    },
    isSideShadeVisible: {
      control: 'boolean',
    },
    sideShadeSide: {
      control: {
        type: 'select',
        labels: sideShadeSideControlLabels,
      },
      options: IMAGE_SIDE_SHADE_SIDE_OPTIONS,
    },
    sideShadeColorToken: {
      control: {
        type: 'select',
      },
      options: TYPOGRAPHY_COLOR_OPTIONS,
    },
    onCropPositionChange: {
      table: {
        disable: true,
      },
    },
    alt: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    src: {
      control: 'text',
    },
  },
} satisfies Meta<StoryArgsType>

export default meta
type StoryType = StoryObj<typeof meta>

export const Preview: StoryType = {}
