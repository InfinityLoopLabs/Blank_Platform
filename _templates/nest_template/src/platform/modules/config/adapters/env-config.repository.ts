import { Injectable } from '@nestjs/common'

import { IConfigRepository } from '../ports/config.repository'

@Injectable()
export class EnvConfigRepository implements IConfigRepository {
  constructor(
    private readonly source: Readonly<
      Record<string, string | undefined>
    > = process.env,
  ) {}

  get(key: string): string | undefined {
    return this.source[key]
  }
}
