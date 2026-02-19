import { Injectable } from '@nestjs/common';

import { ConfigRepository } from '../ports/config.repository';

@Injectable()
export class EnvConfigRepository implements ConfigRepository {
  constructor(private readonly source: NodeJS.ProcessEnv = process.env) {}

  get(key: string): string | undefined {
    return this.source[key];
  }
}
