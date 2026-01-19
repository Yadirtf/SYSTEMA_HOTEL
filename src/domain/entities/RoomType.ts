export class RoomType {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly basePrice: number,
    public readonly capacity: number,
    public readonly extraPersonPrice: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

