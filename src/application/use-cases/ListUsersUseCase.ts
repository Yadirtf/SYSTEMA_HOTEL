import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Person } from '../../domain/entities/Person';
import { Role } from '../../domain/entities/Role';

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();
    
    // Enriquecer datos con información de persona y rol
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const person = await this.userRepository.findPersonByUserId(user.id);
        const role = await this.userRepository.findRoleById(user.roleId);
        return {
          id: user.id,
          email: user.email,
          isActive: user.isActive,
          role: role?.name || 'UNKNOWN',
          firstName: person?.firstName || '',
          lastName: person?.lastName || '',
          phone: person?.phone || '',
          document: person?.document || '',
          createdAt: user.createdAt
        };
      })
    );

    return enrichedUsers;
  }
}

