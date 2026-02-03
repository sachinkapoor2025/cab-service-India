"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const DriverRepository_1 = require("../repositories/DriverRepository");
const RideService_1 = require("./RideService");
const UserService_1 = require("./UserService");
const uuid_1 = require("uuid");
class DriverService {
    static async createDriverProfile(params) {
        const { userId, name, phone, vehicleType, vehicleNumber, licenseNumber, licenseExpiry, aadharNumber, } = params;
        // Validate user exists
        const user = await UserService_1.UserService.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Check if driver profile already exists for this user
        const existingDriver = await DriverRepository_1.DriverRepository.getByUserId(userId);
        if (existingDriver) {
            throw new Error("Driver profile already exists for this user");
        }
        const now = new Date().toISOString();
        const driver = {
            id: (0, uuid_1.v4)(),
            userId,
            name,
            phone,
            vehicleType,
            vehicleNumber,
            documents: {
                licenseNumber,
                licenseExpiry,
                aadharNumber,
            },
            isActive: true,
            isAvailable: true,
            createdAt: now,
            updatedAt: now,
        };
        await DriverRepository_1.DriverRepository.create(driver);
        return driver;
    }
    static async updateDriverProfile(id, updates) {
        const driver = await DriverRepository_1.DriverRepository.getById(id);
        if (!driver) {
            throw new Error("Driver not found");
        }
        // Prevent updating userId and documents structure
        const { userId, documents, ...allowedUpdates } = updates;
        const updateData = {
            ...allowedUpdates,
            updatedAt: new Date().toISOString(),
        };
        await DriverRepository_1.DriverRepository.update(id, updateData);
        // Return updated driver
        const updatedDriver = await DriverRepository_1.DriverRepository.getById(id);
        return updatedDriver;
    }
    static async getAvailableRidesForDriver(driverId) {
        // Get driver to validate they exist
        const driver = await DriverRepository_1.DriverRepository.getById(driverId);
        if (!driver) {
            throw new Error("Driver not found");
        }
        // Get rides with status READY_FOR_DRIVER
        const allRides = await RideService_1.RideService.getAllRides(); // This method needs to be added to RideService
        return allRides.filter((ride) => ride.status === "READY_FOR_DRIVER");
    }
    static async acceptRide(driverId, rideId) {
        const driver = await DriverRepository_1.DriverRepository.getById(driverId);
        if (!driver) {
            throw new Error("Driver not found");
        }
        if (!driver.isActive || !driver.isAvailable) {
            throw new Error("Driver is not available for rides");
        }
        // Get ride details
        const ride = await RideService_1.RideService.getRideById(rideId);
        if (!ride) {
            throw new Error("Ride not found");
        }
        if (ride.status !== "READY_FOR_DRIVER") {
            throw new Error("Ride is not ready for driver assignment");
        }
        // Assign driver to ride and mark as scheduled
        await RideService_1.RideService.assignDriver(rideId, driverId);
        // Mark driver as unavailable and set current ride
        await DriverRepository_1.DriverRepository.update(driverId, {
            isAvailable: false,
            currentRideId: rideId,
        });
        return {
            success: true,
            message: "Ride accepted successfully",
        };
    }
    static async rejectRide(driverId, rideId) {
        const driver = await DriverRepository_1.DriverRepository.getById(driverId);
        if (!driver) {
            throw new Error("Driver not found");
        }
        // Log rejection for audit purposes
        console.log(`Driver ${driverId} rejected ride ${rideId} at ${new Date().toISOString()}`);
        return {
            success: true,
            message: "Ride rejected",
        };
    }
    static async completeRide(driverId, rideId) {
        const driver = await DriverRepository_1.DriverRepository.getById(driverId);
        if (!driver) {
            throw new Error("Driver not found");
        }
        if (driver.currentRideId !== rideId) {
            throw new Error("Driver is not assigned to this ride");
        }
        // Complete the ride
        await RideService_1.RideService.completeRide(rideId);
        // Mark driver as available and clear current ride
        await DriverRepository_1.DriverRepository.update(driverId, {
            isAvailable: true,
            currentRideId: undefined,
        });
    }
    static async getDriverById(id) {
        return await DriverRepository_1.DriverRepository.getById(id);
    }
    static async getDriverByUserId(userId) {
        return await DriverRepository_1.DriverRepository.getByUserId(userId);
    }
    static async getAvailableDrivers() {
        return await DriverRepository_1.DriverRepository.findAvailableDrivers();
    }
}
exports.DriverService = DriverService;
