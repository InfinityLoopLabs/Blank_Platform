import { Sample } from '../../domain/sample.entity'
import { ISampleRepositoryPort } from '../../ports/sample.repository.port'

export class SampleRepositoryMemory implements ISampleRepositoryPort {
  private counter = 0
  private readonly items = new Map<string, Sample>()

  nextId(): string {
    this.counter += 1

    return `ord-${String(this.counter).padStart(4, '0')}`
  }

  async save(sample: Sample): Promise<void> {
    this.items.set(sample.id, sample)
  }
}
