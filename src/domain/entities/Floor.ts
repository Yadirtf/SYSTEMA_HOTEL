export class Floor {
  constructor(
    public readonly id: string,
    public readonly number: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

