import { AppConfig } from '../domain/app-config';

export class AppConfigProvider {
  constructor(public readonly value: AppConfig) {}
}
