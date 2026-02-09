import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class UpdateUserStatusUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(userId: string, isActive: boolean): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    const person = await this.userRepository.findPersonByUserId(userId);
    if (!person) throw new Error('PERSON_NOT_FOUND');

    // Reconstruimos la entidad User con los valores actualizados
    const updatedUserEntity = new User(
      user.id,
      user.email,
      user.password,
      user.roleId,
      isActive,
      user.createdAt,
      new Date(),
      user.deletedAt
    );

    await this.userRepository.update(updatedUserEntity, person);
  }
}

