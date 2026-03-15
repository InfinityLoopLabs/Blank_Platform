import * as React from '../../../../../../node_modules/react';
import type { ElementType } from '../../../../../../node_modules/react';
import { Input } from '../../../components/atoms/Input';
import { type TypographyType } from '../../../components/atoms/Typography';
type EditableTypographyPropertyType = {
    className?: string;
    typography?: TypographyType;
    element?: ElementType;
    isEditModeDisabled?: boolean;
    inputProps?: React.ComponentProps<typeof Input>;
    children?: React.ReactNode;
};
export declare const EditableTypography: ({ className, typography, element, isEditModeDisabled, inputProps, children, }: EditableTypographyPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
