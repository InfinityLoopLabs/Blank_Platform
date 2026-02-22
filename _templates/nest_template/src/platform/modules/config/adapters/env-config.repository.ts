import { Injectable } from '@nestjs/common'

import { IConfigRepository } from '../ports/config.repository'

@Injectable()
export class EnvConfigRepository implements IConfigRepository {
  constructor(private readonly source: NodeJS.ProcessEnv = process.env) {}

  get(key: string): string | undefined {
    return this.source[key]
  }
}
