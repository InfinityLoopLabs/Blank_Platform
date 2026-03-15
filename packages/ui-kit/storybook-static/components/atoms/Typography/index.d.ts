import { FC, AnchorHTMLAttributes } from '../../../../../../node_modules/react';
export type TypographyType = 'H1SemiBold' | 'H2SemiBold' | 'H3Medium' | 'H3SemiBold' | 'H4SemiBold' | 'MRegular' | 'MMedium' | 'MSemiBold' | 'SRegular' | 'SMedium' | 'SSemiBold' | 'XSMedium' | 'MonoMRegular' | 'MonoSRegular' | 'Heading32' | 'Heading24' | 'Heading20' | 'Heading16' | 'Heading14' | 'Heading12' | 'SemiBold52' | 'SemiBold48' | 'SemiBold40' | 'SemiBold32' | 'SemiBold24' | 'SemiBold20' | 'SemiBold16' | 'SemiBold14' | 'Regular24' | 'Regular20' | 'Regular16' | 'Regular14' | 'Regular12' | 'Mono16' | 'ButtonLabel' | 'InputPlaceholder';
type ElementType = 'a' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type OwnPropertyType = {
    typography: TypographyType;
    element?: ElementType;
    className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;
export declare const Typography: FC<OwnPropertyType>;
export {};
