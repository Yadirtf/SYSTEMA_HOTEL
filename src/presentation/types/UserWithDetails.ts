import { User } from '@/domain/entities/User';

export interface UserWithDetails extends User {
    firstName: string;
    lastName: string;
    role: string;
    document: string;
    phone: string;
}
