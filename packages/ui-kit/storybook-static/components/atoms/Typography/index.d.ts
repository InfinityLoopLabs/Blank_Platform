import React, { type ElementType, type HTMLAttributes } from '../../../../../../node_modules/react';
export type TypographyType = 'Heading' | 'SectionHeader' | 'CompactHeader' | 'Action' | 'Subheader' | 'Body' | 'BodySmall' | 'Caption' | 'CompactCaption';
export declare const TYPOGRAPHY_COLOR_OPTIONS: readonly ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground", "muted-foreground", "muted", "primary", "primary-foreground", "secondary", "secondary-foreground", "accent", "accent-foreground", "destructive", "constructive", "constructive-foreground", "cautionary", "cautionary-foreground", "border", "input", "ring", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
export type TypographyColorType = (typeof TYPOGRAPHY_COLOR_OPTIONS)[number];
export declare const TYPOGRAPHY_OPTIONS: TypographyType[];
export declare const getTypographyClassName: (typography: TypographyType) => string;
export declare const getDefaultElementTagByTypography: (typography: TypographyType) => "h1" | "h4" | "h5" | "p" | "span";
export declare const getDefaultColorByTypography: (typography: TypographyType) => "foreground" | "muted-foreground";
export declare const getPlaceholderTypographyClassName: (typography: TypographyType) => string;
type OwnPropertyType = {
    typography: TypographyType;
    element?: ElementType;
    color?: TypographyColorType;
    className?: string;
    isLoading?: boolean;
} & HTMLAttributes<HTMLElement>;
export declare const Typography: {
    ({ typography, element, color, style, className: clsname, isLoading, children, ...props }: OwnPropertyType): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    displayName: string;
};
export {};
