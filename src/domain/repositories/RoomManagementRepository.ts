import { Floor } from '../entities/Floor';
import { Room } from '../entities/Room';
import { RoomType } from '../entities/RoomType';

export interface FloorRepository {
  findAll(): Promise<Floor[]>;
  findById(id: string): Promise<Floor | null>;
  findByNumber(number: number): Promise<Floor | null>;
  save(floor: Floor): Promise<void>;
  update(floor: Floor): Promise<void>;
  delete(id: string): Promise<void>;
  hasRooms(floorId: string): Promise<boolean>;
}

export interface RoomTypeRepository {
  findAll(): Promise<RoomType[]>;
  findById(id: string): Promise<RoomType | null>;
  save(roomType: RoomType): Promise<void>;
  update(roomType: RoomType): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface RoomRepository {
  findAll(): Promise<Room[]>;
  findById(id: string): Promise<Room | null>;
  findByCode(code: string, floorId: string): Promise<Room | null>;
  findByFloor(floorId: string): Promise<Room[]>;
  save(room: Room): Promise<void>;
  update(room: Room): Promise<void>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<void>;
}

