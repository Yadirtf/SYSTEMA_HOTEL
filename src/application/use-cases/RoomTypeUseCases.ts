import { RoomTypeRepository } from '@/domain/repositories/RoomManagementRepository';
import { RoomType } from '@/domain/entities/RoomType';

export class ListRoomTypesUseCase {
  constructor(private roomTypeRepository: RoomTypeRepository) {}

  async execute(): Promise<RoomType[]> {
    return await this.roomTypeRepository.findAll();
  }
}

export interface CreateRoomTypeDTO {
  name: string;
  description?: string;
  basePrice: number;
  capacity: number;
  extraPersonPrice: number;
}

export class CreateRoomTypeUseCase {
  constructor(private roomTypeRepository: RoomTypeRepository) {}

  async execute(dto: CreateRoomTypeDTO): Promise<void> {
    const roomType = new RoomType(
      '',
      dto.name,
      dto.description || null,
      dto.basePrice,
      dto.capacity,
      dto.extraPersonPrice,
      true,
      new Date(),
      new Date()
    );

    await this.roomTypeRepository.save(roomType);
  }
}

export interface UpdateRoomTypeDTO extends CreateRoomTypeDTO {
  id: string;
  isActive: boolean;
}

export class UpdateRoomTypeUseCase {
  constructor(private roomTypeRepository: RoomTypeRepository) {}

  async execute(dto: UpdateRoomTypeDTO): Promise<void> {
    const roomType = await this.roomTypeRepository.findById(dto.id);
    if (!roomType) throw new Error('TIPO_DE_HABITACION_NO_ENCONTRADO');

    const updatedRoomType = new RoomType(
      dto.id,
      dto.name,
      dto.description || null,
      dto.basePrice,
      dto.capacity,
      dto.extraPersonPrice,
      dto.isActive,
      roomType.createdAt,
      new Date()
    );

    await this.roomTypeRepository.update(updatedRoomType);
  }
}

export class DeleteRoomTypeUseCase {
  constructor(private roomTypeRepository: RoomTypeRepository) {}

  async execute(id: string): Promise<void> {
    // Aquí se podría añadir validación si hay habitaciones usando este tipo
    await this.roomTypeRepository.delete(id);
  }
}

