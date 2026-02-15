import { Sample } from '../domain/sample.entity';

export interface SampleRepositoryPort {
  save(sample: Sample): Promise<void>;
  nextId(): string;
}
