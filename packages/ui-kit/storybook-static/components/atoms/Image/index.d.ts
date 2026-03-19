import * as React from '../../../../../../node_modules/react';
import type { TypographyColorType } from '../../../components/atoms/Typography';
export declare const IMAGE_MASK_OPTIONS: readonly [{
    readonly value: 0;
    readonly label: "No Mask";
}, {
    readonly value: 1;
    readonly label: "Octagon Crop";
}, {
    readonly value: 2;
    readonly label: "Circle Crop";
}, {
    readonly value: 3;
    readonly label: "Square Crop";
}];
export type ImageMaskType = (typeof IMAGE_MASK_OPTIONS)[number]['value'];
export declare const IMAGE_SIDE_SHADE_SIDE_OPTIONS: readonly ["left", "right"];
export type ImageSideShadeSideType = (typeof IMAGE_SIDE_SHADE_SIDE_OPTIONS)[number];
export type ImageMaskPositionValueType = {
    x: number;
    y: number;
};
export type ImageCropPositionValueType = {
    x: number;
    y: number;
};
export declare const getImageMaskUrlByType: (maskType: number) => string | undefined;
export type ImagePropertyType = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'className'> & {
    className?: string;
    isLoading?: boolean;
    maskType?: ImageMaskType;
    isEditModeDisabled?: boolean;
    imagePosition?: string;
    isSquareCrop?: boolean;
    cropX?: number;
    cropY?: number;
    cropPositionValue?: ImageCropPositionValueType;
    defaultCropPositionValue?: ImageCropPositionValueType;
    onCropPositionChange?: (value: ImageCropPositionValueType) => void;
    maskSize?: string;
    maskPositionValue?: ImageMaskPositionValueType;
    maskFillColor?: string;
    maskStrokeColor?: string;
    maskStrokeWidth?: number;
    isTopShadeVisible?: boolean;
    topShadeColor?: string;
    isBottomShadeVisible?: boolean;
    bottomShadeColor?: string;
    isSideShadeVisible?: boolean;
    sideShadeSide?: ImageSideShadeSideType;
    sideShadeColorToken?: TypographyColorType;
};
export declare const Image: ({ className, isLoading, maskType, isEditModeDisabled, imagePosition, isSquareCrop, cropX, cropY, cropPositionValue, defaultCropPositionValue, onCropPositionChange, maskSize, maskPositionValue, maskFillColor, maskStrokeColor, maskStrokeWidth, isTopShadeVisible, topShadeColor, isBottomShadeVisible, bottomShadeColor, isSideShadeVisible, sideShadeSide, sideShadeColorToken, alt, style, ...property }: ImagePropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
