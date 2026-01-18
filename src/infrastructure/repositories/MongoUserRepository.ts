import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Role } from '../../domain/entities/Role';
import { Person } from '../../domain/entities/Person';
import { UserModel } from '../db/mongo/models/UserModel';
import { RoleModel } from '../db/mongo/models/RoleModel';
import { PersonModel } from '../db/mongo/models/PersonModel';
import { UserMapper } from '../mappers/UserMapper';

export class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findRoleByName(name: string): Promise<Role | null> {
    const role = await RoleModel.findOne({ name });
    return role ? UserMapper.roleToDomain(role) : null;
  }

  async findRoleById(id: string): Promise<Role | null> {
    const role = await RoleModel.findById(id);
    return role ? UserMapper.roleToDomain(role) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(u => UserMapper.toDomain(u));
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findOne({ _id: id });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findPersonByUserId(userId: string): Promise<Person | null> {
    const person = await PersonModel.findOne({ userId });
    return person ? UserMapper.personToDomain(person) : null;
  }

  async update(user: User): Promise<void> {
    await UserModel.findByIdAndUpdate(user.id, {
      email: user.email,
      roleId: user.roleId,
      isActive: user.isActive,
      deletedAt: user.deletedAt
    });
  }

  async delete(id: string): Promise<void> {
    // Eliminación física total del usuario y su información personal vinculada
    await PersonModel.deleteOne({ userId: id });
    await UserModel.findByIdAndDelete(id);
  }

  async isInitialized(): Promise<boolean> {
    try {
      const adminRole = await RoleModel.findOne({ name: 'ADMIN' });
      if (!adminRole) return false;
      
      const adminUser = await UserModel.findOne({ roleId: adminRole._id });
      return !!adminUser;
    } catch (error) {
      return false;
    }
  }

  async save(user: User, person: Person, role: Role): Promise<void> {
    // Hemos eliminado las transacciones para asegurar compatibilidad total con cualquier MongoDB
    
    // 1. Asegurar que el rol existe o crearlo
    let roleDoc = await RoleModel.findOne({ name: role.name });
    if (!roleDoc) {
      roleDoc = new RoleModel({
        name: role.name,
        description: role.description
      });
      await roleDoc.save();
    }

    // 2. Crear el usuario
    const userDoc = new UserModel({
      email: user.email,
      password: user.password,
      roleId: roleDoc._id,
      isActive: user.isActive
    });
    await userDoc.save();

    // 3. Crear la persona vinculada al usuario
    const personDoc = new PersonModel({
      userId: userDoc._id,
      firstName: person.firstName,
      lastName: person.lastName,
      document: person.document,
      phone: person.phone,
      status: person.status
    });
    await personDoc.save();
  }
}
