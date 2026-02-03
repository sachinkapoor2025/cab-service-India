"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../utils/database");
const TABLE_NAME = process.env.USERS_TABLE;
class UserRepository {
    static async getById(id) {
        const item = await (0, database_1.getItem)(TABLE_NAME, { id });
        return item ? item : null;
    }
    static async getByPhone(phone) {
        const items = await (0, database_1.queryItems)(TABLE_NAME, "phone = :phone", { ":phone": phone }, "PhoneIndex");
        return items.length > 0 ? items[0] : null;
    }
    static async create(user) {
        await (0, database_1.putItem)(TABLE_NAME, user);
    }
    static async update(id, updates) {
        if (!updates || Object.keys(updates).length === 0) {
            return;
        }
        const updateExpressions = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};
        let index = 0;
        for (const [key, value] of Object.entries(updates)) {
            const nameKey = `#attr${index}`;
            const valueKey = `:val${index}`;
            updateExpressions.push(`${nameKey} = ${valueKey}`);
            expressionAttributeNames[nameKey] = key;
            expressionAttributeValues[valueKey] = value;
            index++;
        }
        const updateExpression = `SET ${updateExpressions.join(", ")}`;
        await (0, database_1.updateItem)(TABLE_NAME, { id }, updateExpression, expressionAttributeValues, expressionAttributeNames);
    }
}
exports.UserRepository = UserRepository;
