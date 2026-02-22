import { Sample } from '../domain/sample.entity'

export interface ISampleRepositoryPort {
  save(sample: Sample): Promise<void>
  nextId(): string
}
