import { AppConfigType } from '../domain/app-config'

export class AppConfigProvider {
  constructor(public readonly value: AppConfigType) {}
}
