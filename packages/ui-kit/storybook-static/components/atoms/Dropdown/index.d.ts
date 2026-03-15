import * as React from '../../../../../../node_modules/react';
export type DropdownOptionType = {
    value: string;
    label: string;
};
type DropdownPropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    options: DropdownOptionType[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    label?: React.ReactNode;
    required?: boolean;
    isError?: boolean;
    errorText?: React.ReactNode;
    placeholder?: string;
    isSearchable?: boolean;
    searchPlaceholder?: string;
    disabled?: boolean;
    emptyText?: string;
};
export declare const Dropdown: ({ options, value, defaultValue, onValueChange, label, required, isError, errorText, placeholder, isSearchable, searchPlaceholder, disabled, emptyText, id, "aria-invalid": ariaInvalid, className, ...property }: DropdownPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
