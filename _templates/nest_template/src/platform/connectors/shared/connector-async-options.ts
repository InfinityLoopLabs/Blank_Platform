import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export interface ConnectorAsyncOptions<TOptions> extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject'];
  useFactory: (...args: unknown[]) => Promise<TOptions> | TOptions;
}
