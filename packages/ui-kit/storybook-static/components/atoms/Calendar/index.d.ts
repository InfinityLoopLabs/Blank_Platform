import * as React from '../../../../../../node_modules/react';
import { DayPicker } from 'react-day-picker';
import { type CalendarPickerSelectionScopeType } from '../../../components/atoms/shared/calendar-picker';
type DayPickerPropertyType = React.ComponentProps<typeof DayPicker>;
type CalendarModeType = 'single' | 'range' | 'ranged';
export type CalendarPropertyType = Omit<DayPickerPropertyType, 'mode'> & {
    mode?: CalendarModeType;
    selectionScope?: CalendarPickerSelectionScopeType;
    selected?: any;
    onSelect?: (...args: any[]) => void;
    isLoading?: boolean;
    value?: unknown;
    onChange?: (...args: any[]) => void;
};
export declare const Calendar: {
    ({ className, classNames, isLoading, showOutsideDays, fixedWeeks, value, onChange, month, onMonthChange, onDayClick, mode, selectionScope, ...props }: CalendarPropertyType): import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
    displayName: string;
};
export {};
