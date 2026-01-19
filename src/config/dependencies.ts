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

// Repositories
const userRepository = new MongoUserRepository();

// Services
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

// Use Cases
export const registerAdminUseCase = new RegisterAdminUseCase(userRepository, passwordHasher);
export const getSystemStatusUseCase = new GetSystemStatusUseCase(userRepository);
export const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
export const listUsersUseCase = new ListUsersUseCase(userRepository);
export const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);
export const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);

