import { RoomRepository, RoomTypeRepository } from '@/domain/repositories/RoomManagementRepository';
import { Room, RoomStatus } from '@/domain/entities/Room';

export class ListRoomsUseCase {
  constructor(private roomRepository: RoomRepository) {}

  async execute(floorId?: string): Promise<Room[]> {
    if (floorId) {
      return await this.roomRepository.findByFloor(floorId);
    }
    return await this.roomRepository.findAll();
  }
}

export interface CreateRoomDTO {
  code: string;
  floorId: string;
  typeId: string;
  description?: string;
}

export class CreateRoomUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private roomTypeRepository: RoomTypeRepository
  ) {}

  async execute(dto: CreateRoomDTO): Promise<void> {
    const existing = await this.roomRepository.findByCode(dto.code, dto.floorId);
    if (existing) throw new Error('CODIGO_YA_EXISTE_EN_ESTE_PISO');

    const roomType = await this.roomTypeRepository.findById(dto.typeId);
    if (!roomType) throw new Error('TIPO_HABITACION_NO_VALIDO');

    const room = new Room(
      '',
      dto.code,
      dto.floorId,
      dto.typeId,
      RoomStatus.AVAILABLE,
      roomType.basePrice, // Hereda el precio base del tipo
      dto.description || null,
      true,
      new Date(),
      new Date()
    );

    await this.roomRepository.save(room);
  }
}

export class UpdateRoomStatusUseCase {
  constructor(private roomRepository: RoomRepository) {}

  async execute(id: string, status: RoomStatus): Promise<void> {
    await this.roomRepository.updateStatus(id, status);
  }
}

export class DeleteRoomUseCase {
  constructor(private roomRepository: RoomRepository) {}

  async execute(id: string): Promise<void> {
    // Aquí se podría validar si tiene historial operativo según requerimiento 2.6
    await this.roomRepository.delete(id);
  }
}

