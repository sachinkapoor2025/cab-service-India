"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const uuid_1 = require("uuid");
class UserService {
    static async getUserById(id) {
        return await UserRepository_1.UserRepository.getById(id);
    }
    static async getUserByPhone(phone) {
        return await UserRepository_1.UserRepository.getByPhone(phone);
    }
    static async createUser(params) {
        const { phone, role, name, email, gender } = params;
        const existingUser = await UserRepository_1.UserRepository.getByPhone(phone);
        if (existingUser) {
            return existingUser;
        }
        const now = new Date().toISOString();
        const user = {
            id: (0, uuid_1.v4)(),
            phone,
            role,
            name,
            email,
            gender,
            emergencyContacts: [],
            createdAt: now,
            updatedAt: now,
        };
        await UserRepository_1.UserRepository.create(user);
        return user;
    }
    static async updateUser(id, updates) {
        updates.updatedAt = new Date().toISOString();
        await UserRepository_1.UserRepository.update(id, updates);
    }
    static async updateEmergencyContacts(id, contacts) {
        if (contacts.length !== 2) {
            throw new Error("Exactly 2 emergency contacts are required");
        }
        await this.updateUser(id, {
            emergencyContacts: contacts,
        });
    }
}
exports.UserService = UserService;
