import {
  StoreSlide,
  type StoreSlidePropertyType,
} from '@/components/molecules/SlideTemplates'

export type MediumVerticalSlidePropertyType = StoreSlidePropertyType

export const MediumVerticalSlide = (
  property: MediumVerticalSlidePropertyType,
) => <StoreSlide {...property} />
