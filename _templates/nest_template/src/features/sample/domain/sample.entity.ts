export class Sample {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly totalCents: number,
    public readonly hasItems: boolean,
    public readonly isPriority: boolean,
  ) {}

  static create(input: {
    id: string
    name: string
    totalCents: number
    isPriority: boolean
  }): Sample {
    if (!input.id.trim()) {
      throw new Error('sample id must not be empty')
    }
    if (!input.name.trim()) {
      throw new Error('sample name must not be empty')
    }
    if (input.totalCents <= 0) {
      throw new Error('sample total must be greater than zero')
    }

    return new Sample(
      input.id.trim(),
      input.name.trim(),
      input.totalCents,
      true,
      input.isPriority,
    )
  }
}
