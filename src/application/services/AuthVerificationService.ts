import { UserRepository } from '@/domain/repositories/UserRepository';

interface VerificationResult {
    isValid: boolean;
    error?: string;
    status?: number;
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export class AuthVerificationService {
    constructor(private userRepository: UserRepository) { }

    async verifyUser(userId: string, requiredRoles: string[]): Promise<VerificationResult> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return { isValid: false, error: 'USER_NOT_FOUND', status: 401 };
        }

        if (!user.isActive) {
            return { isValid: false, error: 'USER_INACTIVE', status: 403 };
        }

        // Check if user is deleted (if 'deletedAt' is part of the domain entity, which it should be)
        // Assuming the domain entity has these fields based on previous context
        if ((user as any).deletedAt) {
            return { isValid: false, error: 'USER_DELETED', status: 403 };
        }

        const role = await this.userRepository.findRoleById(user.roleId);
        if (!role) {
            return { isValid: false, error: 'ROLE_NOT_FOUND', status: 403 };
        }

        if (!requiredRoles.includes(role.name)) {
            return { isValid: false, error: 'FORBIDDEN', status: 403 };
        }

        return {
            isValid: true,
            user: {
                id: user.id,
                email: user.email,
                role: role.name
            }
        };
    }
}
