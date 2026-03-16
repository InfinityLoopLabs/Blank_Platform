import type { HTMLAttributes } from '../../../../../../node_modules/react';
import { type TypographyColorType } from '../../../components/atoms/Typography';
export declare const TAG_TYPE_OPTIONS: readonly ["default", "time"];
export type TagType = (typeof TAG_TYPE_OPTIONS)[number];
type TagPropertyType = HTMLAttributes<HTMLSpanElement> & {
    label: string;
    type?: TagType;
    color?: TypographyColorType;
    textColor?: TypographyColorType;
    isLoading?: boolean;
};
export declare const Tag: ({ label, type, color, textColor, className, isLoading, ...property }: TagPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
