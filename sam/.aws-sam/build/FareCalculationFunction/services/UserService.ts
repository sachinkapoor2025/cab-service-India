import { User, UserRole, Gender } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  static async getUserById(id: string): Promise<User | null> {
    return await UserRepository.getById(id);
  }

  static async getUserByPhone(phone: string): Promise<User | null> {
    return await UserRepository.getByPhone(phone);
  }

  static async createUser(params: {
    phone: string;
    role: UserRole;
    name?: string;
    email?: string;
    gender?: Gender;
  }): Promise<User> {
    const { phone, role, name, email, gender } = params;

    const existingUser = await UserRepository.getByPhone(phone);
    if (existingUser) {
      return existingUser;
    }

    const now = new Date().toISOString();

    const user: User = {
      id: uuidv4(),
      phone,
      role,
      name,
      email,
      gender,
      emergencyContacts: [],
      createdAt: now,
      updatedAt: now,
    };

    await UserRepository.create(user);
    return user;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    updates.updatedAt = new Date().toISOString();
    await UserRepository.update(id, updates);
  }

  static async updateEmergencyContacts(
    id: string,
    contacts: string[],
  ): Promise<void> {
    if (contacts.length !== 2) {
      throw new Error("Exactly 2 emergency contacts are required");
    }

    await this.updateUser(id, {
      emergencyContacts: contacts,
    });
  }
}
