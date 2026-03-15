import * as React from '../../../../../../node_modules/react';
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
export type ImageMaskPositionValueType = {
    x: number;
    y: number;
};
export type ImageCropPositionValueType = {
    x: number;
    y: number;
};
export declare const getImageMaskUrlByType: (maskType: number) => string | undefined;
type ImagePropertyType = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'className'> & {
    className?: string;
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
};
export declare const Image: ({ className, maskType, isEditModeDisabled, imagePosition, isSquareCrop, cropX, cropY, cropPositionValue, defaultCropPositionValue, onCropPositionChange, maskSize, maskPositionValue, maskFillColor, maskStrokeColor, maskStrokeWidth, alt, style, ...property }: ImagePropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
