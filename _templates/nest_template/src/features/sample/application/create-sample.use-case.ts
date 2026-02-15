import { Sample } from '../domain/sample.entity';
import { SampleRepositoryPort } from '../ports/sample.repository.port';

export type CreateSampleInput = {
  name: string;
  totalCents: number;
  isPriority: boolean;
};

export class CreateSampleUseCase {
  constructor(private readonly repository: SampleRepositoryPort) {}

  async execute(input: CreateSampleInput): Promise<Sample> {
    const sample = Sample.create({
      id: this.repository.nextId(),
      name: input.name,
      totalCents: input.totalCents,
      isPriority: input.isPriority,
    });

    await this.repository.save(sample);
    return sample;
  }
}
