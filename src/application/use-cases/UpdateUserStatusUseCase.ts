import { UserRepository } from '../../domain/repositories/UserRepository';

export class UpdateUserStatusUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, isActive: boolean): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    const updatedUser = {
      ...user,
      isActive,
      updatedAt: new Date()
    };

    const person = await this.userRepository.findPersonByUserId(userId);
    if (!person) throw new Error('PERSON_NOT_FOUND');

    // Usamos el casting porque en el dominio son readonly pero el repo los actualizará
    await this.userRepository.update(updatedUser as any, person);
  }
}

