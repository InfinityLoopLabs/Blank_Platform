import * as React from '../../../../../../node_modules/react';
import { type TypographyType } from '../../../components/atoms/Typography';
export type InputVariantType = 'outline' | 'text';
type InputSharedPropertyType = {
    className?: string;
    variant?: InputVariantType;
    typography?: TypographyType;
    isTextarea?: boolean;
    isResizableX?: boolean;
    isResizableY?: boolean;
    textareaRowsCount?: number;
    isError?: boolean;
    label?: React.ReactNode;
    errorText?: React.ReactNode;
};
type SingleLineInputPropertyType = InputSharedPropertyType & React.ComponentProps<'input'> & {
    isTextarea?: false;
};
type MultiLineInputPropertyType = InputSharedPropertyType & Omit<React.ComponentProps<'textarea'>, 'rows' | 'type'> & {
    isTextarea: true;
};
type InputPropertyType = SingleLineInputPropertyType | MultiLineInputPropertyType;
declare function Input(property: InputPropertyType): import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export { Input };
