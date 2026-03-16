import * as React from '../../../../../../../node_modules/react';
import { type ImagePropertyType } from '../../../../components/atoms/Image';
export type StoreSlideImageChangePayloadType = {
    file: File;
    objectUrl: string;
};
type StoreSlidePropertyType = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
    isSetModeEnabled?: boolean;
    setModelEnabled?: boolean;
    coverImageSrc: string;
    coverImageAlt?: string;
    isImageLoading?: boolean;
    imageProps?: Omit<ImagePropertyType, 'src' | 'alt' | 'className'>;
    imageAccept?: string;
    onImageChange?: (payload: StoreSlideImageChangePayloadType) => void;
    brandName: React.ReactNode;
    brandIcon?: React.ReactNode;
    heading: React.ReactNode;
    accentText?: React.ReactNode;
    description?: React.ReactNode;
    priceText: React.ReactNode;
    tagText?: string;
    badgeText?: React.ReactNode;
};
export declare const StoreSlide: ({ className, isSetModeEnabled, setModelEnabled, coverImageSrc, coverImageAlt, isImageLoading, imageProps, imageAccept, onImageChange, brandName, brandIcon, heading, accentText, description, priceText, tagText, badgeText, ...property }: StoreSlidePropertyType) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
