import * as React from '../../../../../../../node_modules/react';
import type { StoreSlideTagItemType } from '../../../../components/molecules/SlideTemplates';
export type SliderDemoSlideItemType = {
    id: string;
    coverImageSrc: string;
    brandName: string;
    heading: string;
    accentText: string;
    description: string;
    priceText: string;
    tagText: string;
};
export declare const courseSlideData: SliderDemoSlideItemType[];
export declare const sliderSlideComponentTypeOptions: readonly ["MediumVerticalSlide", "MediumHorizontalSlide", "BigHorizontalSlide"];
export type SliderSlideComponentType = (typeof sliderSlideComponentTypeOptions)[number];
export declare const mediumVerticalSlideWidthClassName = "w-[460px] min-w-[460px]";
export declare const mediumHorizontalSlideWidthClassName = "w-[520px] min-w-[520px]";
export declare const bigHorizontalSlideWidthClassName = "w-[620px] min-w-[620px]";
type TagVariantType = 'no-tags' | 'one-tag' | 'two-tags' | 'two-other-tags';
export declare const getTagsByVariant: (variant: TagVariantType, slideId: string, baseLabel: string) => {
    tags: StoreSlideTagItemType[];
    tagText?: string;
};
export type BuildSliderSlidesPropertyType = {
    componentType: SliderSlideComponentType;
    isEditModeEnabled?: boolean;
    isEditModeDisabled?: boolean;
    onTagClick?: (id: string) => void;
    onTagLabelChange?: (id: string, value: string) => void;
};
export declare const buildSliderSlides: ({ componentType, isEditModeEnabled, isEditModeDisabled, onTagClick, onTagLabelChange, }: BuildSliderSlidesPropertyType) => React.ReactNode[];
export {};
