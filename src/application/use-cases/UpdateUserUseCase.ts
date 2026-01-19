import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Person } from '../../domain/entities/Person';
import { Role } from '../../domain/entities/Role';

export interface UpdateUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  phone: string;
  role: string;
  isActive: boolean;
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UpdateUserDTO): Promise<void> {
    const user = await this.userRepository.findById(data.id);
    if (!user) throw new Error('USER_NOT_FOUND');

    // 1. Validar restricción: No editar único admin (opcional, se puede manejar en controller)
    
    // 2. Buscar rol
    const role = await this.userRepository.findRoleByName(data.role);
    if (!role) throw new Error('ROLE_NOT_FOUND');

    // 3. Crear objetos de dominio actualizados
    const updatedUser = new User(
      user.id,
      user.email,
      user.password,
      role.id,
      data.isActive,
      user.createdAt,
      new Date()
    );

    const updatedPerson = new Person(
      '',
      user.id,
      data.firstName,
      data.lastName,
      data.document,
      data.phone,
      data.isActive ? 'ACTIVE' : 'INACTIVE',
      new Date(), // createdAt se ignora en update
      new Date()
    );

    await this.userRepository.update(updatedUser, updatedPerson);
  }
}

