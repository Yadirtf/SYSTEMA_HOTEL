import { UserRepository } from '../../domain/repositories/UserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    // No permitir que el admin se elimine a sí mismo (opcional pero recomendado)
    // Esto se validaría comparando con el ID del admin que hace la petición en el controlador
    
    await this.userRepository.delete(userId);
  }
}

