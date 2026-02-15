import { FieldValues, UseFormReturn } from 'react-hook-form'

export type UseFormPropsType<T extends FieldValues> = Partial<
  UseFormReturn<T>
> & {
  control: UseFormReturn<T>['control']
}
