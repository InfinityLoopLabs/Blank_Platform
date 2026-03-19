import * as React from '../../../../../../node_modules/react';
import { type CalendarPropertyType } from '../../../components/atoms/Calendar';
import { type CalendarPickerCalendarSlotPropertyType, type CalendarPickerControlStatePropertyType, type CalendarPickerPopoverSlotPropertyType } from '../../../components/atoms/shared/calendar-picker';
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
type CalendarInputModePropertyType = InputCalendarPropertyType & {
    type: 'calendar';
    isTextarea?: false;
};
type InputPropertyType = SingleLineInputPropertyType | MultiLineInputPropertyType | CalendarInputModePropertyType;
export type InputCalendarPropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & Omit<CalendarPropertyType, 'mode' | 'value' | 'onChange' | 'selected' | 'onSelect'> & CalendarPickerControlStatePropertyType & CalendarPickerPopoverSlotPropertyType & CalendarPickerCalendarSlotPropertyType<CalendarPropertyType> & {
    label?: React.ReactNode;
    isRequired?: boolean;
    isError?: boolean;
    errorText?: React.ReactNode;
    inputClassName?: string;
    name?: string;
    id?: string;
};
declare function Input(property: InputPropertyType): import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export declare const InputCalendar: ({ className, inputClassName, label, isRequired, isError, errorText, placeholder, mode, selectionScope, value, defaultValue, onChange, isOpen, isOpenByDefault, onIsOpenChange, disabled, isLoading, popoverComponent: PopoverComponent, calendarComponent: CalendarComponent, numberOfMonths, name, id, ...calendarProperty }: InputCalendarPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export { Input };
