import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordHasher } from '../../domain/security/PasswordHasher';
import { RegisterAdminDTO } from '../dtos/RegisterAdminDTO';
import { User } from '../../domain/entities/User';
import { Person } from '../../domain/entities/Person';
import { Role } from '../../domain/entities/Role';

export class RegisterAdminUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(data: RegisterAdminDTO): Promise<void> {
    // 1. Validar si el sistema ya está inicializado
    const isInitialized = await this.userRepository.isInitialized();
    if (isInitialized) {
      throw new Error('SYSTEM_ALREADY_INITIALIZED');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await this.passwordHasher.hash(data.password);

    // 3. Crear objetos de dominio (sin IDs reales todavía, el repo los manejará)
    const adminRole = new Role('', 'ADMIN', 'Acceso total al sistema', new Date(), new Date());
    
    const user = new User(
      '',
      data.email,
      hashedPassword,
      '', // roleId se asignará en el repo
      true,
      new Date(),
      new Date()
    );

    const person = new Person(
      '',
      '', // userId se asignará en el repo
      data.firstName,
      data.lastName,
      data.document,
      data.phone,
      'ACTIVE',
      new Date(),
      new Date()
    );

    // 4. Guardar atómicamente
    await this.userRepository.save(user, person, adminRole);
  }
}

