import { Floor } from '@/domain/entities/Floor';
import { RoomType } from '@/domain/entities/RoomType';
import { Room, RoomStatus } from '@/domain/entities/Room';
import { IFloorSchema } from '../db/mongo/models/FloorModel';
import { IRoomTypeSchema } from '../db/mongo/models/RoomTypeModel';
import { IRoomSchema } from '../db/mongo/models/RoomModel';

export class RoomManagementMapper {
  static toFloorDomain(doc: IFloorSchema): Floor {
    return new Floor(
      doc._id.toString(),
      doc.number,
      doc.name,
      doc.description || '', // Handle potentially null description
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toRoomTypeDomain(doc: IRoomTypeSchema): RoomType {
    return new RoomType(
      doc._id.toString(),
      doc.name,
      doc.description || '',
      doc.basePrice,
      doc.capacity,
      doc.extraPersonPrice,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toRoomDomain(doc: IRoomSchema): Room {
    const docAny = doc as any;
    // Si floorId o typeId están populados, extraemos el ID. Si no, usamos el valor directamente.
    const floorId = docAny.floorId?._id ? docAny.floorId._id.toString() : docAny.floorId?.toString() || '';
    const typeId = docAny.typeId?._id ? docAny.typeId._id.toString() : docAny.typeId?.toString() || '';

    return new Room(
      doc._id.toString(),
      doc.code,
      floorId,
      typeId,
      doc.status as RoomStatus,
      doc.basePrice,
      doc.description || '',
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
