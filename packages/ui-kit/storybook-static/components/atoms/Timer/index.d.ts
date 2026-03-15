import React from '../../../../../../node_modules/react';
type TimerLabelsType = {
    days: React.ReactNode;
    hours: React.ReactNode;
    minutes: React.ReactNode;
    seconds: React.ReactNode;
};
export type TimerPropertyType = {
    targetDate: Date | number | string;
    className?: string;
    itemClassName?: string;
    labels?: Partial<TimerLabelsType>;
    onComplete?: () => void;
};
export declare const Timer: {
    ({ targetDate, className, itemClassName, labels, onComplete, }: TimerPropertyType): import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
    displayName: string;
};
export {};
