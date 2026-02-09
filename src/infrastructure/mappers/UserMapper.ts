import { User } from '../../domain/entities/User';
import { Role } from '../../domain/entities/Role';
import { Person } from '../../domain/entities/Person';
import { IUserSchema } from '../db/mongo/models/UserModel';
import { IRoleSchema } from '../db/mongo/models/RoleModel';
import { IPersonSchema } from '../db/mongo/models/PersonModel';

export class UserMapper {
  static toDomain(userSchema: IUserSchema): User {
    return new User(
      userSchema._id.toString(),
      userSchema.email,
      userSchema.password,
      userSchema.roleId.toString(),
      userSchema.isActive,
      userSchema.createdAt,
      userSchema.updatedAt,
      userSchema.deletedAt || null
    );
  }

  static roleToDomain(roleSchema: IRoleSchema): Role {
    return new Role(
      roleSchema._id.toString(),
      roleSchema.name,
      roleSchema.description,
      roleSchema.createdAt,
      roleSchema.updatedAt
    );
  }

  static personToDomain(personSchema: IPersonSchema): Person {
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

