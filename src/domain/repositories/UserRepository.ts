import { User } from '../entities/User';
import { Person } from '../entities/Person';
import { Role } from '../entities/Role';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User, person: Person, role: Role): Promise<void>;
  isInitialized(): Promise<boolean>;
  findRoleByName(name: string): Promise<Role | null>;
  findRoleById(id: string): Promise<Role | null>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findPersonByUserId(userId: string): Promise<Person | null>;
}

