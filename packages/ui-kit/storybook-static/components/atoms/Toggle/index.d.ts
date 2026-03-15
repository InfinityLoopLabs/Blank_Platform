import * as React from '../../../../../../node_modules/react';
type TogglePropertyType = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
    className?: string;
    leftLabel?: React.ReactNode;
    rightLabel?: React.ReactNode;
    labelClassName?: string;
};
export declare const Toggle: ({ className, leftLabel, rightLabel, labelClassName, id, disabled, ...property }: TogglePropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
