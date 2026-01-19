import { FloorRepository, RoomTypeRepository, RoomRepository } from '@/domain/repositories/RoomManagementRepository';
import { Floor } from '@/domain/entities/Floor';

export class ListFloorsUseCase {
  constructor(private floorRepository: FloorRepository) {}

  async execute(): Promise<Floor[]> {
    return await this.floorRepository.findAll();
  }
}

export interface CreateFloorDTO {
  number: number;
  name: string;
  description?: string;
}

export class CreateFloorUseCase {
  constructor(private floorRepository: FloorRepository) {}

  async execute(dto: CreateFloorDTO): Promise<void> {
    const existing = await this.floorRepository.findByNumber(dto.number);
    if (existing) throw new Error('EL_NUMERO_DE_PISO_YA_EXISTE');

    const floor = new Floor(
      '',
      dto.number,
      dto.name,
      dto.description || null,
      true,
      new Date(),
      new Date()
    );

    await this.floorRepository.save(floor);
  }
}

export class DeleteFloorUseCase {
  constructor(private floorRepository: FloorRepository) {}

  async execute(id: string): Promise<void> {
    const hasRooms = await this.floorRepository.hasRooms(id);
    if (hasRooms) throw new Error('NO_SE_PUEDE_ELIMINAR_PISO_CON_HABITACIONES');

    await this.floorRepository.delete(id);
  }
}

export interface UpdateFloorDTO {
  id: string;
  number: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export class UpdateFloorUseCase {
  constructor(private floorRepository: FloorRepository) {}

  async execute(dto: UpdateFloorDTO): Promise<void> {
    const floor = await this.floorRepository.findById(dto.id);
    if (!floor) throw new Error('PISO_NO_ENCONTRADO');

    const updatedFloor = new Floor(
      dto.id,
      dto.number,
      dto.name,
      dto.description || null,
      dto.isActive,
      floor.createdAt,
      new Date()
    );

    await this.floorRepository.update(updatedFloor);
  }
}

