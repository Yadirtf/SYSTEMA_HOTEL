import { User } from '../../domain/entities/User';
import { Role } from '../../domain/entities/Role';
import { Person } from '../../domain/entities/Person';

export class UserMapper {
  static toDomain(userSchema: any): User {
    return new User(
      userSchema._id.toString(),
      userSchema.email,
      userSchema.password,
      userSchema.roleId.toString(),
      userSchema.isActive,
      userSchema.createdAt,
      userSchema.updatedAt,
      userSchema.deletedAt
    );
  }

  static roleToDomain(roleSchema: any): Role {
    return new Role(
      roleSchema._id.toString(),
      roleSchema.name,
      roleSchema.description,
      roleSchema.createdAt,
      roleSchema.updatedAt
    );
  }

  static personToDomain(personSchema: any): Person {
    return new Person(
      personSchema._id.toString(),
      personSchema.userId.toString(),
      personSchema.firstName,
      personSchema.lastName,
      personSchema.document,
      personSchema.phone,
      personSchema.status,
      personSchema.createdAt,
      personSchema.updatedAt
    );
  }
}

