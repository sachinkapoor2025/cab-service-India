"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const RideRepository_1 = require("../repositories/RideRepository");
const UserService_1 = require("./UserService");
const uuid_1 = require("uuid");
class RideService {
    static async createRide(params) {
        const { requesterId, source, destination, route, dateTime, seats, farePerSeat, isShared, femaleOnly, } = params;
        // Validate requester exists
        const requester = await UserService_1.UserService.getUserById(requesterId);
        if (!requester) {
            throw new Error("Requester not found");
        }
        const now = new Date().toISOString();
        const ride = {
            id: (0, uuid_1.v4)(),
            requesterId,
            source,
            destination,
            route,
            dateTime,
            maxSeats: seats,
            availableSeats: isShared ? seats : seats - 1, // If private, requester takes 1 seat
            farePerSeat,
            isShared,
            femaleOnly,
            status: isShared ? "WAITING_FOR_MATCH" : "REQUESTED",
            passengers: isShared ? [] : [requesterId], // If private, requester is passenger
            createdAt: now,
            updatedAt: now,
        };
        await RideRepository_1.RideRepository.create(ride);
        // If private ride, check if we can auto-assign READY_FOR_DRIVER
        if (!isShared && ride.availableSeats === 0) {
            await this.markReadyForDriver(ride.id);
        }
        return ride;
    }
    static async joinSharedRide(rideId, userId) {
        const ride = await RideRepository_1.RideRepository.getById(rideId);
        if (!ride) {
            throw new Error("Ride not found");
        }
        if (!ride.isShared) {
            throw new Error("Cannot join private ride");
        }
        if (ride.status !== "WAITING_FOR_MATCH") {
            throw new Error("Ride is not available for joining");
        }
        if (ride.availableSeats <= 0) {
            throw new Error("No seats available");
        }
        // Check gender compatibility if female-only
        if (ride.femaleOnly) {
            const user = await UserService_1.UserService.getUserById(userId);
            if (!user || user.gender !== "FEMALE") {
                throw new Error("This ride is female-only");
            }
        }
        // Add user to passengers
        const updatedPassengers = [...ride.passengers, userId];
        const updatedAvailableSeats = ride.availableSeats - 1;
        const updates = {
            passengers: updatedPassengers,
            availableSeats: updatedAvailableSeats,
            updatedAt: new Date().toISOString(),
        };
        // If seats are filled, mark as READY_FOR_DRIVER
        if (updatedAvailableSeats === 0) {
            updates.status = "READY_FOR_DRIVER";
        }
        await RideRepository_1.RideRepository.update(rideId, updates);
        const updatedRide = { ...ride, ...updates };
        return updatedRide;
    }
    static async searchSharedRides(params) {
        const { route, dateTime, femaleOnly } = params;
        let rides = await RideRepository_1.RideRepository.findMatchingSharedRides(route, dateTime);
        // Filter by female-only if requested
        if (femaleOnly) {
            rides = rides.filter((ride) => ride.femaleOnly);
        }
        return rides;
    }
    static async getRideById(id) {
        return await RideRepository_1.RideRepository.getById(id);
    }
    static async getRidesByRequester(requesterId) {
        return await RideRepository_1.RideRepository.getRidesByRequester(requesterId);
    }
    static async markReadyForDriver(rideId) {
        const ride = await RideRepository_1.RideRepository.getById(rideId);
        if (!ride) {
            throw new Error("Ride not found");
        }
        if (ride.status !== "WAITING_FOR_MATCH" && ride.status !== "REQUESTED") {
            throw new Error("Ride status does not allow marking as ready for driver");
        }
        await RideRepository_1.RideRepository.update(rideId, {
            status: "READY_FOR_DRIVER",
            updatedAt: new Date().toISOString(),
        });
    }
    // Driver accepts ride
    static async assignDriver(rideId, driverId) {
        const ride = await RideRepository_1.RideRepository.getById(rideId);
        if (!ride) {
            throw new Error("Ride not found");
        }
        if (ride.status !== "READY_FOR_DRIVER") {
            throw new Error("Ride is not ready for driver assignment");
        }
        await RideRepository_1.RideRepository.update(rideId, {
            driverId,
            status: "SCHEDULED",
            updatedAt: new Date().toISOString(),
        });
    }
    // Start ride
    static async startRide(rideId) {
        await RideRepository_1.RideRepository.update(rideId, {
            status: "IN_PROGRESS",
            updatedAt: new Date().toISOString(),
        });
    }
    // Complete ride
    static async completeRide(rideId) {
        await RideRepository_1.RideRepository.update(rideId, {
            status: "COMPLETED",
            updatedAt: new Date().toISOString(),
        });
    }
    // Cancel ride
    static async cancelRide(rideId) {
        await RideRepository_1.RideRepository.update(rideId, {
            status: "CANCELLED",
            updatedAt: new Date().toISOString(),
        });
    }
    // Get all rides (for driver service)
    static async getAllRides() {
        // This would need to be implemented in RideRepository
        // For now, we'll need to add a method to get all rides
        throw new Error("getAllRides method not yet implemented");
    }
}
exports.RideService = RideService;
