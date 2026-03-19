import * as React from '../../../../../../node_modules/react';
import type { DateRange } from 'react-day-picker';
export type CalendarPickerModeType = 'single' | 'range' | 'ranged';
export type CalendarPickerSelectionScopeType = 'date' | 'month' | 'monthYear';
export type CalendarSelectionType = Date | DateRange | undefined;
export type CalendarPickerControlStatePropertyType = {
    mode?: CalendarPickerModeType;
    selectionScope?: CalendarPickerSelectionScopeType;
    value?: CalendarSelectionType;
    defaultValue?: CalendarSelectionType;
    onChange?: (value: CalendarSelectionType) => void;
    placeholder?: string;
    isOpen?: boolean;
    isOpenByDefault?: boolean;
    onIsOpenChange?: (isOpen: boolean) => void;
    disabled?: boolean;
    isLoading?: boolean;
};
export type CalendarPickerCalendarSlotPropertyType<CalendarComponentPropertyType> = {
    calendarComponent?: React.ComponentType<CalendarComponentPropertyType>;
};
export type CalendarPickerPopoverSlotPropertyType = {
    popoverComponent?: React.ComponentType<{
        children: React.ReactNode;
    }>;
};
export declare const isDateRangeValue: (value: CalendarSelectionType) => value is DateRange;
export declare const normalizeCalendarPickerMode: (mode: CalendarPickerModeType) => "single" | "range";
export declare const formatCalendarValue: ({ mode, selectionScope, value, placeholder, }: {
    mode: CalendarPickerModeType;
    selectionScope?: CalendarPickerSelectionScopeType;
    value: CalendarSelectionType;
    placeholder: string;
}) => string;
export declare const usePickerOpenState: <PropertyType extends {
    isOpen?: boolean;
    isOpenByDefault?: boolean;
}>(property: PropertyType, onIsOpenChange?: (isOpen: boolean) => void) => {
    isOpen: boolean;
    setIsOpen: (nextIsOpen: boolean) => void;
};
export declare const useOutsideDismiss: (rootReference: React.RefObject<HTMLElement | null>, isOpen: boolean, onDismiss: () => void) => void;
