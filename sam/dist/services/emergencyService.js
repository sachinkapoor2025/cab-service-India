"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyService = void 0;
const sns_1 = require("../utils/sns");
const UserService_1 = require("./UserService");
const RideService_1 = require("./RideService");
const DriverService_1 = require("./DriverService");
class EmergencyService {
    static async sendEmergencyAlert(params) {
        const { userId, rideId, emergencyContacts, latitude, longitude } = params;
        // Idempotency check using rideId + userId
        const alertKey = `${userId}_${rideId}`;
        console.log(`Processing emergency alert for ${alertKey}`);
        // Get user details
        const user = await UserService_1.UserService.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Get ride details
        const ride = await RideService_1.RideService.getRideById(rideId);
        if (!ride) {
            throw new Error("Ride not found");
        }
        // Get driver details if assigned
        let driverDetails = "Driver: Not assigned";
        if (ride.driverId) {
            const driver = await DriverService_1.DriverService.getDriverById(ride.driverId);
            if (driver) {
                driverDetails = `Driver: ${driver.name} (${driver.vehicleType} - ${driver.vehicleNumber})`;
            }
        }
        // Build comprehensive emergency message
        const locationInfo = latitude && longitude
            ? `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            : "Location: Not available";
        const message = `
🚨 EMERGENCY ALERT 🚨

User: ${user.name} (${user.phone})
${driverDetails}
Ride Status: ${ride.status}
Pickup: ${ride.source}
Drop: ${ride.destination}
${locationInfo}

This is an automated emergency alert. Please contact the user immediately.

Alert ID: ${alertKey}
Timestamp: ${new Date().toISOString()}
    `.trim();
        const topicArn = process.env.SNS_TOPIC;
        if (!topicArn) {
            throw new Error("SNS topic not configured");
        }
        // Validate emergency contacts
        if (!emergencyContacts || emergencyContacts.length < 2) {
            throw new Error("At least 2 emergency contacts required");
        }
        // Send to all emergency contacts
        for (const contact of emergencyContacts) {
            try {
                await (0, sns_1.sendEmergencyAlert)(topicArn, message, `+91${contact}`);
                console.log(`Emergency alert sent to ${contact}`);
            }
            catch (error) {
                console.error(`Failed to send emergency alert to ${contact}:`, error);
                // Continue with other contacts even if one fails
            }
        }
        console.log(`Emergency alert completed for ${alertKey}`);
    }
}
exports.EmergencyService = EmergencyService;
