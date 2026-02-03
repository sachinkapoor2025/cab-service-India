"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRepository = void 0;
const database_1 = require("../utils/database");
const TABLE_NAME = process.env.DRIVERS_TABLE;
class DriverRepository {
    static async getById(id) {
        const item = await (0, database_1.getItem)(TABLE_NAME, { id });
        return item || null;
    }
    static async getByUserId(userId) {
        const items = await (0, database_1.queryItems)(TABLE_NAME, "userId = :userId", { ":userId": userId }, "UserIndex");
        return items.length > 0 ? items[0] : null;
    }
    static async create(driver) {
        await (0, database_1.putItem)(TABLE_NAME, driver);
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
    static async findAvailableDrivers() {
        const items = await (0, database_1.scanItems)(TABLE_NAME);
        return items.filter((driver) => driver.isActive && driver.isAvailable);
    }
}
exports.DriverRepository = DriverRepository;
