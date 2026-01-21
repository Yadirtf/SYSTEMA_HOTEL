import { MongoUserRepository } from '../infrastructure/repositories/MongoUserRepository';
import { BcryptPasswordHasher } from '../infrastructure/security/BcryptPasswordHasher';
import { RegisterAdminUseCase } from '../application/use-cases/RegisterAdminUseCase';
import { GetSystemStatusUseCase } from '../application/use-cases/GetSystemStatusUseCase';
import { JwtTokenService } from '../infrastructure/security/JwtTokenService';
import { LoginUserUseCase } from '../application/use-cases/LoginUserUseCase';
import { ListUsersUseCase } from '../application/use-cases/ListUsersUseCase';
import { CreateUserUseCase } from '../application/use-cases/CreateUserUseCase';
import { DeleteUserUseCase } from '../application/use-cases/DeleteUserUseCase';
import { UpdateUserStatusUseCase } from '../application/use-cases/UpdateUserStatusUseCase';
import { UpdateUserUseCase } from '../application/use-cases/UpdateUserUseCase';

// Room Management
import { MongoFloorRepository, MongoRoomTypeRepository, MongoRoomRepository } from '../infrastructure/repositories/MongoRoomManagementRepository';
import { 
  ListFloorsUseCase, 
  CreateFloorUseCase, 
  UpdateFloorUseCase, 
  DeleteFloorUseCase 
} from '../application/use-cases/FloorUseCases';
import { 
  ListRoomTypesUseCase, 
  CreateRoomTypeUseCase, 
  UpdateRoomTypeUseCase, 
  DeleteRoomTypeUseCase 
} from '../application/use-cases/RoomTypeUseCases';
import { 
  ListRoomsUseCase, 
  CreateRoomUseCase, 
  UpdateRoomStatusUseCase, 
  DeleteRoomUseCase 
} from '../application/use-cases/RoomUseCases';

// Store Management
import { MongoStoreRepository } from '../infrastructure/repositories/MongoStoreRepository';
import { CategoryUseCases, UnitUseCases, ProductUseCases, KardexUseCases, SaleUseCases } from '../application/use-cases/StoreUseCases';

// Repositories
const userRepository = new MongoUserRepository();
const floorRepository = new MongoFloorRepository();
const roomTypeRepository = new MongoRoomTypeRepository();
const roomRepository = new MongoRoomRepository();
const storeRepository = new MongoStoreRepository();

// Services
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

// Use Cases - Auth & Users
export const registerAdminUseCase = new RegisterAdminUseCase(userRepository, passwordHasher);
export const getSystemStatusUseCase = new GetSystemStatusUseCase(userRepository);
export const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
export const listUsersUseCase = new ListUsersUseCase(userRepository);
export const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);
export const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);

// Use Cases - Floors
export const listFloorsUseCase = new ListFloorsUseCase(floorRepository);
export const createFloorUseCase = new CreateFloorUseCase(floorRepository);
export const updateFloorUseCase = new UpdateFloorUseCase(floorRepository);
export const deleteFloorUseCase = new DeleteFloorUseCase(floorRepository);

// Use Cases - Room Types
export const listRoomTypesUseCase = new ListRoomTypesUseCase(roomTypeRepository);
export const createRoomTypeUseCase = new CreateRoomTypeUseCase(roomTypeRepository);
export const updateRoomTypeUseCase = new UpdateRoomTypeUseCase(roomTypeRepository);
export const deleteRoomTypeUseCase = new DeleteRoomTypeUseCase(roomTypeRepository);

// Use Cases - Rooms
export const listRoomsUseCase = new ListRoomsUseCase(roomRepository);
export const createRoomUseCase = new CreateRoomUseCase(roomRepository, roomTypeRepository);
export const updateRoomStatusUseCase = new UpdateRoomStatusUseCase(roomRepository);
export const deleteRoomUseCase = new DeleteRoomUseCase(roomRepository);

// Use Cases - Store
export const categoryUseCases = new CategoryUseCases(storeRepository);
export const unitUseCases = new UnitUseCases(storeRepository);
export const productUseCases = new ProductUseCases(storeRepository);
export const kardexUseCases = new KardexUseCases(storeRepository);
export const saleUseCases = new SaleUseCases(storeRepository);
