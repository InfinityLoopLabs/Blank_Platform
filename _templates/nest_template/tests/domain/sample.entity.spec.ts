import { Sample } from '../../src/features/sample/domain/sample.entity';

describe('Sample domain entity', () => {
  it('creates a valid sample', () => {
    const sample = Sample.create({
      id: 'ord-0001',
      name: 'starter',
      totalCents: 5000,
      isPriority: true,
    });

    expect(sample.hasItems).toBe(true);
    expect(sample.isPriority).toBe(true);
  });

  it('rejects invalid totals', () => {
    expect(() =>
      Sample.create({
        id: 'ord-0002',
        name: 'starter',
        totalCents: 0,
        isPriority: false,
      }),
    ).toThrow('sample total must be greater than zero');
  });
});
