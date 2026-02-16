export type FormInRegistryType = {
  id: string
  trigger: () => Promise<boolean>
  getValues: () => unknown
}
