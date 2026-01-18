import { UserRepository } from '../../domain/repositories/UserRepository';

export class GetSystemStatusUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<{ initialized: boolean }> {
    const initialized = await this.userRepository.isInitialized();
    return { initialized };
  }
}

