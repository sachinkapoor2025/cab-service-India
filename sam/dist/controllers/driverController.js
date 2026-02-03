"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DriverService_1 = require("../services/DriverService");
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
        /* ---------------- POST /drivers/create ---------------- */
        if (httpMethod === "POST" && pathParameters?.proxy === "create") {
            if (!body) {
                return buildResponse(400, { error: "Request body is required" });
            }
            const { userId, name, phone, vehicleType, vehicleNumber, licenseNumber, licenseExpiry, aadharNumber, } = JSON.parse(body);
            // Validation
            if (!userId ||
                !name ||
                !phone ||
                !vehicleType ||
                !vehicleNumber ||
                !licenseNumber ||
                !licenseExpiry ||
                !aadharNumber) {
                return buildResponse(400, {
                    error: "userId, name, phone, vehicleType, vehicleNumber, licenseNumber, licenseExpiry, and aadharNumber are required",
                });
            }
            const driver = await DriverService_1.DriverService.createDriverProfile({
                userId,
                name,
                phone,
                vehicleType,
                vehicleNumber,
                licenseNumber,
                licenseExpiry,
                aadharNumber,
            });
            return buildResponse(201, { success: true, driver });
        }
        /* ---------------- PUT /drivers/{id} ---------------- */
        if (httpMethod === "PUT" && pathParameters?.id) {
            if (!body) {
                return buildResponse(400, { error: "Request body is required" });
            }
            const updates = JSON.parse(body);
            const updatedDriver = await DriverService_1.DriverService.updateDriverProfile(pathParameters.id, updates);
            return buildResponse(200, { success: true, driver: updatedDriver });
        }
        /* ---------------- GET /drivers/available-rides ---------------- */
        if (httpMethod === "GET" && pathParameters?.proxy === "available-rides") {
            const driverId = pathParameters.id;
            if (!driverId) {
                return buildResponse(400, { error: "Driver ID is required" });
            }
            const rides = await DriverService_1.DriverService.getAvailableRidesForDriver(driverId);
            return buildResponse(200, { rides });
        }
        /* ---------------- POST /drivers/{id}/accept-ride ---------------- */
        if (httpMethod === "POST" &&
            pathParameters?.id &&
            pathParameters?.proxy === "accept-ride") {
            if (!body) {
                return buildResponse(400, { error: "Request body is required" });
            }
            const { rideId } = JSON.parse(body);
            if (!rideId) {
                return buildResponse(400, { error: "rideId is required" });
            }
            const result = await DriverService_1.DriverService.acceptRide(pathParameters.id, rideId);
            return buildResponse(200, result);
        }
        /* ---------------- POST /drivers/{id}/reject-ride ---------------- */
        if (httpMethod === "POST" &&
            pathParameters?.id &&
            pathParameters?.proxy === "reject-ride") {
            if (!body) {
                return buildResponse(400, { error: "Request body is required" });
            }
            const { rideId } = JSON.parse(body);
            if (!rideId) {
                return buildResponse(400, { error: "rideId is required" });
            }
            const result = await DriverService_1.DriverService.rejectRide(pathParameters.id, rideId);
            return buildResponse(200, result);
        }
        /* ---------------- GET /drivers/{id} ---------------- */
        if (httpMethod === "GET" && pathParameters?.id) {
            const driver = await DriverService_1.DriverService.getDriverById(pathParameters.id);
            if (!driver) {
                return buildResponse(404, { error: "Driver not found" });
            }
            return buildResponse(200, driver);
        }
        /* ---------------- METHOD NOT ALLOWED ---------------- */
        return buildResponse(405, { error: "Method not allowed" });
    }
    catch (error) {
        console.error("Error in driverController:", error);
        return buildResponse(500, {
            error: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.handler = handler;
