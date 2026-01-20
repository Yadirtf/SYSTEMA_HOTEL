import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Person } from '../../domain/entities/Person';

export interface UpdateUserDTO {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  document?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UpdateUserDTO): Promise<void> {
    // 1. Obtener usuario actual
    const user = await this.userRepository.findById(data.id);
    if (!user) throw new Error('USER_NOT_FOUND');

    // 2. Obtener persona actual para no perder datos (como el documento si no se envía)
    const person = await this.userRepository.findPersonByUserId(data.id);
    if (!person) throw new Error('PERSON_NOT_FOUND');

    // 3. Buscar rol (si se envía, si no mantener el actual)
    let roleId = user.roleId;
    if (data.role) {
      const role = await this.userRepository.findRoleByName(data.role);
      if (!role) throw new Error('ROLE_NOT_FOUND');
      roleId = role.id;
    }

    // 4. Crear objetos de dominio actualizados respetando valores existentes
    const updatedUser = new User(
      user.id,
      data.email ?? user.email,
      user.password,
      roleId,
      data.isActive ?? user.isActive,
      user.createdAt,
      new Date()
    );

    const updatedPerson = new Person(
      person.id,
      user.id,
      data.firstName ?? person.firstName,
      data.lastName ?? person.lastName,
      data.document ?? person.document,
      data.phone ?? person.phone,
      (data.isActive ?? user.isActive) ? 'ACTIVE' : 'INACTIVE',
      person.createdAt,
      new Date()
    );

    await this.userRepository.update(updatedUser, updatedPerson);
  }
}
