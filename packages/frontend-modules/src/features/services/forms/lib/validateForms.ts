import { useSelector } from 'react-redux'
import type { FormInRegistryType } from './types'

type FormsStateShapeType = {
  forms?: {
    formsRegistry?: Record<string, FormInRegistryType>
  }
}

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
  const formsRegistry = useSelector(
    (state: FormsStateShapeType) => state.forms?.formsRegistry ?? {},
  )

  return async (formIds: string[]) => {
    const filteredForms = formIds
      .map(id => formsRegistry[id])
      .filter((form): form is FormInRegistryType => Boolean(form))

    return validateForms(filteredForms)
  }
}
