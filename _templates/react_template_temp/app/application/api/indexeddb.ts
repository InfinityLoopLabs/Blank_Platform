import { IndexedDB } from '@infinityloop.labs/utils'

export const indexeddbName = 'infinityloop.labs'
export const indexedDBInstance = new IndexedDB(indexeddbName)

export enum IndexedDbTableNamesEnum {
  PR_EMPLOYEE_ACHIEVEMENTS_AND_GOALS_FORM_DRAFT = 'PR_EMPLOYEE_ACHIEVEMENTS_AND_GOALS_FORM_DRAFT',
}

export const indexedDbTableNames = [
  IndexedDbTableNamesEnum.PR_EMPLOYEE_ACHIEVEMENTS_AND_GOALS_FORM_DRAFT,
]

export const indexedDbVersion = 1
