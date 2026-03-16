import * as React from '../../../../../../../node_modules/react';
import { type ImagePropertyType } from '../../../../components/atoms/Image';
import { type TagType } from '../../../../components/atoms/Tag';
export type VideoSlideImageChangePayloadType = {
    file: File;
    objectUrl: string;
};
type VideoSlidePropertyType = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
    isSetModeEnabled?: boolean;
    setModelEnabled?: boolean;
    isEditModeForcedDisabled?: boolean;
    isLoading?: boolean;
    coverImageSrc: string;
    coverImageAlt?: string;
    isImageLoading?: boolean;
    imageProps?: Omit<ImagePropertyType, 'src' | 'alt' | 'className'>;
    imageAccept?: string;
    onImageChange?: (payload: VideoSlideImageChangePayloadType) => void;
    brandName: React.ReactNode;
    brandIcon?: React.ReactNode;
    heading: React.ReactNode;
    viewsText?: React.ReactNode;
    tagText?: React.ReactNode;
    tagType?: TagType;
    durationText?: React.ReactNode;
};
export declare const VideoSlide: ({ className, isSetModeEnabled, setModelEnabled, isEditModeForcedDisabled, isLoading, coverImageSrc, coverImageAlt, isImageLoading, imageProps, imageAccept, onImageChange, brandName, brandIcon, heading, viewsText, tagText, tagType, durationText, ...property }: VideoSlidePropertyType) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
