import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordHasher } from '../../domain/security/PasswordHasher';
import { RegisterAdminDTO } from '../dtos/RegisterAdminDTO';
import { User } from '../../domain/entities/User';
import { Person } from '../../domain/entities/Person';
import { Role } from '../../domain/entities/Role';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(data: RegisterAdminDTO & { role: string }): Promise<void> {
    // 1. Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new Error('EMAIL_ALREADY_EXISTS');

    // 2. Buscar el rol solicitado
    let role = await this.userRepository.findRoleByName(data.role);
    if (!role) {
      // Si el rol no existe, por ahora lo creamos (según la fase 1, ADMIN y RECEPCIONISTA deben existir)
      role = new Role('', data.role, `Rol de ${data.role}`, new Date(), new Date());
    }

    // 3. Hashear contraseña
    const hashedPassword = await this.passwordHasher.hash(data.password);

    // 4. Crear dominio
    const user = new User('', data.email, hashedPassword, '', true, new Date(), new Date());
    const person = new Person('', '', data.firstName, data.lastName, data.document, data.phone, 'ACTIVE', new Date(), new Date());

    // 5. Guardar
    await this.userRepository.save(user, person, role);
  }
}

