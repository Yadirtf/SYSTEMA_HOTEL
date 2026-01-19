import { Floor } from '@/domain/entities/Floor';
import { Room } from '@/domain/entities/Room';
import { RoomType } from '@/domain/entities/RoomType';
import { FloorRepository, RoomRepository, RoomTypeRepository } from '@/domain/repositories/RoomManagementRepository';
import { FloorModel } from '../db/mongo/models/FloorModel';
import { RoomTypeModel } from '../db/mongo/models/RoomTypeModel';
import { RoomModel } from '../db/mongo/models/RoomModel';
import { RoomManagementMapper } from '../mappers/RoomManagementMapper';

export class MongoFloorRepository implements FloorRepository {
  async findAll(): Promise<Floor[]> {
    const docs = await FloorModel.find().sort({ number: 1 });
    return docs.map(RoomManagementMapper.toFloorDomain);
  }

  async findById(id: string): Promise<Floor | null> {
    const doc = await FloorModel.findById(id);
    return doc ? RoomManagementMapper.toFloorDomain(doc) : null;
  }

  async findByNumber(number: number): Promise<Floor | null> {
    const doc = await FloorModel.findOne({ number });
    return doc ? RoomManagementMapper.toFloorDomain(doc) : null;
  }

  async save(floor: Floor): Promise<void> {
    await FloorModel.create({
      number: floor.number,
      name: floor.name,
      description: floor.description,
      isActive: floor.isActive
    });
  }

  async update(floor: Floor): Promise<void> {
    await FloorModel.findByIdAndUpdate(floor.id, {
      number: floor.number,
      name: floor.name,
      description: floor.description,
      isActive: floor.isActive
    });
  }

  async delete(id: string): Promise<void> {
    await FloorModel.findByIdAndDelete(id);
  }

  async hasRooms(floorId: string): Promise<boolean> {
    const count = await RoomModel.countDocuments({ floorId });
    return count > 0;
  }
}

export class MongoRoomTypeRepository implements RoomTypeRepository {
  async findAll(): Promise<RoomType[]> {
    const docs = await RoomTypeModel.find().sort({ name: 1 });
    return docs.map(RoomManagementMapper.toRoomTypeDomain);
  }

  async findById(id: string): Promise<RoomType | null> {
    const doc = await RoomTypeModel.findById(id);
    return doc ? RoomManagementMapper.toRoomTypeDomain(doc) : null;
  }

  async save(roomType: RoomType): Promise<void> {
    await RoomTypeModel.create({
      name: roomType.name,
      description: roomType.description,
      basePrice: roomType.basePrice,
      capacity: roomType.capacity,
      extraPersonPrice: roomType.extraPersonPrice,
      isActive: roomType.isActive
    });
  }

  async update(roomType: RoomType): Promise<void> {
    await RoomTypeModel.findByIdAndUpdate(roomType.id, {
      name: roomType.name,
      description: roomType.description,
      basePrice: roomType.basePrice,
      capacity: roomType.capacity,
      extraPersonPrice: roomType.extraPersonPrice,
      isActive: roomType.isActive
    });
  }

  async delete(id: string): Promise<void> {
    await RoomTypeModel.findByIdAndDelete(id);
  }
}

export class MongoRoomRepository implements RoomRepository {
  async findAll(): Promise<Room[]> {
    const docs = await RoomModel.find().populate('floorId').populate('typeId');
    return docs.map(RoomManagementMapper.toRoomDomain);
  }

  async findById(id: string): Promise<Room | null> {
    const doc = await RoomModel.findById(id);
    return doc ? RoomManagementMapper.toRoomDomain(doc) : null;
  }

  async findByCode(code: string, floorId: string): Promise<Room | null> {
    const doc = await RoomModel.findOne({ code, floorId });
    return doc ? RoomManagementMapper.toRoomDomain(doc) : null;
  }

  async findByFloor(floorId: string): Promise<Room[]> {
    const docs = await RoomModel.find({ floorId }).sort({ code: 1 });
    return docs.map(RoomManagementMapper.toRoomDomain);
  }

  async save(room: Room): Promise<void> {
    await RoomModel.create({
      code: room.code,
      floorId: room.floorId,
      typeId: room.typeId,
      status: room.status,
      basePrice: room.basePrice,
      description: room.description,
      isActive: room.isActive
    });
  }

  async update(room: Room): Promise<void> {
    await RoomModel.findByIdAndUpdate(room.id, {
      code: room.code,
      floorId: room.floorId,
      typeId: room.typeId,
      status: room.status,
      basePrice: room.basePrice,
      description: room.description,
      isActive: room.isActive
    });
  }

  async delete(id: string): Promise<void> {
    await RoomModel.findByIdAndDelete(id);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await RoomModel.findByIdAndUpdate(id, { status });
  }
}

