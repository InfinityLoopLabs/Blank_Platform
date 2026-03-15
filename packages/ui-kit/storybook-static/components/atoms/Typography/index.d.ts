import React, { type ElementType, type HTMLAttributes } from '../../../../../../node_modules/react';
export type TypographyType = 'Action' | 'Subheader' | 'Caption';
export declare const TYPOGRAPHY_OPTIONS: TypographyType[];
export declare const getTypographyClassName: (typography: TypographyType) => string;
export declare const getPlaceholderTypographyClassName: (typography: TypographyType) => string;
type OwnPropertyType = {
    typography: TypographyType;
    element?: ElementType;
    className?: string;
} & HTMLAttributes<HTMLElement>;
export declare const Typography: {
    ({ typography, element, className: clsname, children, ...props }: OwnPropertyType): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    displayName: string;
};
export {};
