import type { StoreSlideTagItemType } from '../../../../components/molecules/SlideTemplates';
export type BigHorizontalSlidePropertyType = {
    coverImageSrc: string;
    brandName: string;
    heading: string;
    description: string;
    tagText?: string;
    tags?: StoreSlideTagItemType[];
    isEditModeEnabled?: boolean;
    isEditModeDisabled?: boolean;
    onTagClick?: (id: string) => void;
    onTagLabelChange?: (id: string, value: string) => void;
};
export declare const BigHorizontalSlide: ({ coverImageSrc, brandName, heading, description, tagText, tags, isEditModeEnabled, isEditModeDisabled, onTagClick, onTagLabelChange, }: BigHorizontalSlidePropertyType) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
