"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRepository = void 0;
const database_1 = require("../utils/database");
const TABLE_NAME = process.env.RIDES_TABLE;
class RideRepository {
    static async getById(id) {
        const item = await (0, database_1.getItem)(TABLE_NAME, { id });
        return item || null;
    }
    static async create(ride) {
        await (0, database_1.putItem)(TABLE_NAME, ride);
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
    static async findMatchingSharedRides(route, dateTime, maxDistance = 3600000) {
        // Query by route and dateTime range using RouteDateIndex
        const startTime = new Date(dateTime).getTime() - maxDistance;
        const endTime = new Date(dateTime).getTime() + maxDistance;
        const startTimeStr = new Date(startTime).toISOString();
        const endTimeStr = new Date(endTime).toISOString();
        const items = await (0, database_1.queryItems)(TABLE_NAME, "route = :route AND dateTime BETWEEN :start AND :end", {
            ":route": route,
            ":start": startTimeStr,
            ":end": endTimeStr,
        }, "RouteDateIndex");
        // Filter for shared rides that are waiting for match and have available seats
        return items.filter((ride) => ride.isShared &&
            ride.status === "WAITING_FOR_MATCH" &&
            ride.availableSeats > 0);
    }
    static async getRidesByDriver(driverId) {
        const items = await (0, database_1.queryItems)(TABLE_NAME, "driverId = :driverId", { ":driverId": driverId }, "DriverIndex");
        return items;
    }
    static async getRidesByRequester(requesterId) {
        const items = await (0, database_1.queryItems)(TABLE_NAME, "requesterId = :requesterId", { ":requesterId": requesterId }, "RequesterIndex");
        return items;
    }
    static async getAllRides() {
        const items = await (0, database_1.scanItems)(TABLE_NAME);
        return items;
    }
}
exports.RideRepository = RideRepository;
