import { useAppSelector } from '@hooks/useAppSelector'
import type { FormInRegistryType } from '@services/forms/lib/types'

export const validateForms = async (forms: FormInRegistryType[]) => {
  const results = await Promise.all(forms.map(form => form.trigger()))
  const isOk = results.every(Boolean)
  const values = forms.map(form => form.getValues())

  return {
    isOk,
    values,
  }
}

export const useValidateDistributedForm = () => {
  const { formsRegistry } = useAppSelector(state => state.forms)

  return async (formIds: string[]) => {
    const filteredForms = formIds
      .map(id => formsRegistry[id])
      .filter((form): form is FormInRegistryType => Boolean(form))

    return validateForms(filteredForms)
  }
}
