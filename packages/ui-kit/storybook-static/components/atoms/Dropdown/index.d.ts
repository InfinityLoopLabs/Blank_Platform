import * as React from '../../../../../../node_modules/react';
import { type CalendarPropertyType } from '../../../components/atoms/Calendar';
import { type CalendarPickerCalendarSlotPropertyType, type CalendarPickerControlStatePropertyType, type CalendarPickerPopoverSlotPropertyType } from '../../../components/atoms/shared/calendar-picker';
export type DropdownOptionType = {
    value: string;
    label: string;
};
type DropdownListPropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    type?: 'default';
    popoverComponent?: React.ComponentType<{
        children: React.ReactNode;
    }>;
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
export type DropdownCalendarPropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & Omit<CalendarPropertyType, 'mode' | 'value' | 'onChange' | 'selected' | 'onSelect'> & CalendarPickerControlStatePropertyType & CalendarPickerPopoverSlotPropertyType & CalendarPickerCalendarSlotPropertyType<CalendarPropertyType> & {
    label?: React.ReactNode;
    isRequired?: boolean;
    isError?: boolean;
    errorText?: React.ReactNode;
    triggerClassName?: string;
};
export type DropdownPropertyType = DropdownListPropertyType | (DropdownCalendarPropertyType & {
    type: 'calendar';
});
export declare const Dropdown: (property: DropdownPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export declare const DropdownCalendar: ({ className, triggerClassName, label, isRequired, isError, errorText, placeholder, mode, selectionScope, value, defaultValue, onChange, isOpen, isOpenByDefault, onIsOpenChange, disabled, isLoading, popoverComponent: PopoverComponent, calendarComponent: CalendarComponent, numberOfMonths, ...calendarProperty }: DropdownCalendarPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
