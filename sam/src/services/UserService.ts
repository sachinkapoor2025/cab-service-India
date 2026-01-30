import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  static async getUserById(id: string): Promise<User | null> {
    return await UserRepository.getById(id);
  }

  static async getUserByPhone(phone: string): Promise<User | null> {
    return await UserRepository.getByPhone(phone);
  }

  static async createUser(
    phone: string,
    name?: string,
    email?: string,
  ): Promise<User> {
    const existingUser = await UserRepository.getByPhone(phone);
    if (existingUser) {
      return existingUser;
    }

    const user: User = {
      id: uuidv4(),
      phone,
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await UserRepository.create(user);
    return user;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    updates.updatedAt = new Date().toISOString();
    await UserRepository.update(id, updates);
  }
}
