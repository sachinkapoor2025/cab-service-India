"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../services/UserService");
const buildResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    },
    body: JSON.stringify(body),
});
const handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;
        /* ---------------- OPTIONS (CORS) ---------------- */
        if (httpMethod === "OPTIONS") {
            return buildResponse(200, {});
        }
        /* ---------------- GET USER ---------------- */
        if (httpMethod === "GET") {
            if (!pathParameters?.id) {
                return buildResponse(400, { error: "User ID is required" });
            }
            const user = await UserService_1.UserService.getUserById(pathParameters.id);
            if (!user) {
                return buildResponse(404, { error: "User not found" });
            }
            return buildResponse(200, user);
        }
        /* ---------------- CREATE / LOGIN USER ---------------- */
        if (httpMethod === "POST") {
            if (!body) {
                return buildResponse(400, { error: "Request body is required" });
            }
            const { phone, role, name, email, gender } = JSON.parse(body);
            // Validation
            if (!phone || !role) {
                return buildResponse(400, {
                    error: "phone and role are required",
                });
            }
            if (!["STUDENT", "DRIVER"].includes(role)) {
                return buildResponse(400, { error: "Invalid role" });
            }
            if (gender && !["MALE", "FEMALE", "OTHER"].includes(gender)) {
                return buildResponse(400, { error: "Invalid gender" });
            }
            const user = await UserService_1.UserService.createUser({
                phone,
                role: role,
                name,
                email,
                gender: gender,
            });
            return buildResponse(200, {
                success: true,
                user,
            });
        }
        /* ---------------- UPDATE USER ---------------- */
        if (httpMethod === "PUT") {
            if (!pathParameters?.id || !body) {
                return buildResponse(400, {
                    error: "User ID and request body are required",
                });
            }
            const updates = JSON.parse(body);
            await UserService_1.UserService.updateUser(pathParameters.id, updates);
            return buildResponse(200, {
                message: "User updated successfully",
            });
        }
        /* ---------------- METHOD NOT ALLOWED ---------------- */
        return buildResponse(405, { error: "Method not allowed" });
    }
    catch (error) {
        console.error("Error in userController:", error);
        return buildResponse(500, { error: "Internal server error" });
    }
};
exports.handler = handler;
