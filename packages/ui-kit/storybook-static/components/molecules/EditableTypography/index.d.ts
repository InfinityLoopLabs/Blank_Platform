import * as React from '../../../../../../node_modules/react';
import type { ElementType } from '../../../../../../node_modules/react';
import { type TypographyType } from '../../../components/atoms/Typography';
type EditableTypographyPropertyType = {
    className?: string;
    typography?: TypographyType;
    element?: ElementType;
    isEditModeDisabled?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onValueChange?: (value: string) => void;
    children?: React.ReactNode;
};
export declare const EditableTypography: ({ className, typography, element, isEditModeDisabled, value, defaultValue, placeholder, onValueChange, children, }: EditableTypographyPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
