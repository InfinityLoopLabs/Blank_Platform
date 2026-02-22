import { Sample } from '../domain/sample.entity'
import { ISampleRepositoryPort } from '../ports/sample.repository.port'

export type CreateSampleInputType = {
  name: string
  totalCents: number
  isPriority: boolean
}

export class CreateSampleUseCase {
  constructor(private readonly repository: ISampleRepositoryPort) {}

  async execute(input: CreateSampleInputType): Promise<Sample> {
    const sample = Sample.create({
      id: this.repository.nextId(),
      name: input.name,
      totalCents: input.totalCents,
      isPriority: input.isPriority,
    })

    await this.repository.save(sample)

    return sample
  }
}
