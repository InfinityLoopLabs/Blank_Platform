import type { FieldValues, UseFormReturn, Control } from 'react-hook-form'

export type UseFormControlType<T extends FieldValues> = Control<T>

export type UseFormPropsType<T extends FieldValues> = Partial<
  UseFormReturn<T>
> & {
  control: UseFormControlType<T>
}
