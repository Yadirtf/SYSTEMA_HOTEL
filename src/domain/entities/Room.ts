export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE'
}

export class Room {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly floorId: string,
    public readonly typeId: string,
    public readonly status: RoomStatus,
    public readonly basePrice: number,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

