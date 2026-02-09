import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordHasher } from '../../domain/security/PasswordHasher';
import { TokenService } from '../../domain/security/TokenService';
import { LoginUserDTO } from '../dtos/LoginUserDTO';

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private tokenService: TokenService
  ) { }

  async execute(data: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new Error('USER_INACTIVE');
    }

    const isPasswordValid = await this.passwordHasher.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const role = await this.userRepository.findRoleById(user.roleId);

    const token = this.tokenService.generate({
      sub: user.id,
      id: user.id, // RoleGuard espera 'id'
      email: user.email,
      role: role?.name || 'USER'
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: role?.name || 'USER'
      }
    };
  }
}

