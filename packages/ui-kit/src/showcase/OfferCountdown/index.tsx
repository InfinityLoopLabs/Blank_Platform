import * as React from 'react'
import type { HTMLAttributes } from 'react'

import { clsx } from '@infinityloop.labs/utils'
import { ArrowRight } from 'lucide-react'

import {
  Button,
  Flex,
  Image,
  Paper,
  Timer,
  Typography,
} from '@/components/atoms'

const OFFER_DURATION_IN_MS = 48 * 60 * 60 * 1000
const OFFER_IMAGE_URL =
  'https://ideogram.ai/assets/image/balanced/response/5vFcpmLUSSa_BwrhU4WiGQ@2k'

const imageOrientationClassNameDictionary = {
  vertical: 'aspect-[9/16]',
  horizontal: 'aspect-[21/9]',
} as const

const cardWidthClassNameDictionary = {
  vertical: 'max-w-sm',
  horizontal: 'max-w-5xl',
} as const

type OfferCountdownPropertyType = HTMLAttributes<HTMLDivElement> & {
  ctaText?: string
  imageOrientation?: keyof typeof imageOrientationClassNameDictionary
}

export const OfferCountdown = ({
  className,
  ctaText = 'Успей купить',
  imageOrientation = 'vertical',
  ...property
}: OfferCountdownPropertyType) => {
  const [targetDate] = React.useState(
    () => new Date(Date.now() + OFFER_DURATION_IN_MS),
  )
  const isHorizontal = imageOrientation === 'horizontal'

  return (
    <Paper
      type="dark"
      className={clsx(
        'w-full p-4',
        cardWidthClassNameDictionary[imageOrientation],
        className,
      )}
      {...property}>
      <Flex column className="w-full gap-4">
        <Image
          src={OFFER_IMAGE_URL}
          alt="Offer preview"
          isEditModeDisabled
          isTopShadeVisible={isHorizontal}
          isBottomShadeVisible
          className={clsx(
            'w-full border border-(--border)',
            imageOrientationClassNameDictionary[imageOrientation],
          )}
        />

        <Flex column className="items-center gap-2">
          <Typography typography="Caption">До конца предложения</Typography>
          <Timer targetDate={targetDate} />
        </Flex>

        <Button
          className="w-full"
          color="chart-1"
          animation="active"
          rightIcon={<ArrowRight className="size-4" />}>
          {ctaText}
        </Button>
      </Flex>
    </Paper>
  )
}
