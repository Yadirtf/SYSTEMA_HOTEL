import { Floor } from '@/domain/entities/Floor';
import { RoomType } from '@/domain/entities/RoomType';
import { Room, RoomStatus } from '@/domain/entities/Room';

export class RoomManagementMapper {
  static toFloorDomain(doc: any): Floor {
    return new Floor(
      doc._id.toString(),
      doc.number,
      doc.name,
      doc.description,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toRoomTypeDomain(doc: any): RoomType {
    return new RoomType(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.basePrice,
      doc.capacity,
      doc.extraPersonPrice,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toRoomDomain(doc: any): Room {
    // Si floorId o typeId están populados, extraemos el ID. Si no, usamos el valor directamente.
    const floorId = doc.floorId?._id ? doc.floorId._id.toString() : doc.floorId?.toString() || '';
    const typeId = doc.typeId?._id ? doc.typeId._id.toString() : doc.typeId?.toString() || '';

    return new Room(
      doc._id.toString(),
      doc.code,
      floorId,
      typeId,
      doc.status as RoomStatus,
      doc.basePrice,
      doc.description,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
