import { Driver } from "../models/Driver";
import { DriverRepository } from "../repositories/DriverRepository";
import { RideService } from "./RideService";
import { UserService } from "./UserService";
import { v4 as uuidv4 } from "uuid";

export class DriverService {
  static async createDriverProfile(params: {
    userId: string;
    name: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
    licenseExpiry: string;
    aadharNumber: string;
  }): Promise<Driver> {
    const {
      userId,
      name,
      phone,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      licenseExpiry,
      aadharNumber,
    } = params;

    // Validate user exists
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if driver profile already exists for this user
    const existingDriver = await DriverRepository.getByUserId(userId);
    if (existingDriver) {
      throw new Error("Driver profile already exists for this user");
    }

    const now = new Date().toISOString();

    const driver: Driver = {
      id: uuidv4(),
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

    await DriverRepository.create(driver);
    return driver;
  }

  static async updateDriverProfile(
    id: string,
    updates: Partial<Driver>,
  ): Promise<Driver> {
    const driver = await DriverRepository.getById(id);
    if (!driver) {
      throw new Error("Driver not found");
    }

    // Prevent updating userId and documents structure
    const { userId, documents, ...allowedUpdates } = updates;

    const updateData: Partial<Driver> = {
      ...allowedUpdates,
      updatedAt: new Date().toISOString(),
    };

    await DriverRepository.update(id, updateData);

    // Return updated driver
    const updatedDriver = await DriverRepository.getById(id);
    return updatedDriver!;
  }

  static async getAvailableRidesForDriver(driverId: string): Promise<any[]> {
    // Get driver to validate they exist
    const driver = await DriverRepository.getById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    // Get rides with status READY_FOR_DRIVER
    const allRides = await RideService.getAllRides(); // This method needs to be added to RideService
    return allRides.filter((ride: any) => ride.status === "READY_FOR_DRIVER");
  }

  static async acceptRide(
    driverId: string,
    rideId: string,
  ): Promise<{ success: boolean; message: string }> {
    const driver = await DriverRepository.getById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    if (!driver.isActive || !driver.isAvailable) {
      throw new Error("Driver is not available for rides");
    }

    // Get ride details
    const ride = await RideService.getRideById(rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }

    if (ride.status !== "READY_FOR_DRIVER") {
      throw new Error("Ride is not ready for driver assignment");
    }

    // Assign driver to ride and mark as scheduled
    await RideService.assignDriver(rideId, driverId);

    // Mark driver as unavailable and set current ride
    await DriverRepository.update(driverId, {
      isAvailable: false,
      currentRideId: rideId,
    });

    return {
      success: true,
      message: "Ride accepted successfully",
    };
  }

  static async rejectRide(
    driverId: string,
    rideId: string,
  ): Promise<{ success: boolean; message: string }> {
    const driver = await DriverRepository.getById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    // Log rejection for audit purposes
    console.log(
      `Driver ${driverId} rejected ride ${rideId} at ${new Date().toISOString()}`,
    );

    return {
      success: true,
      message: "Ride rejected",
    };
  }

  static async completeRide(driverId: string, rideId: string): Promise<void> {
    const driver = await DriverRepository.getById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    if (driver.currentRideId !== rideId) {
      throw new Error("Driver is not assigned to this ride");
    }

    // Complete the ride
    await RideService.completeRide(rideId);

    // Mark driver as available and clear current ride
    await DriverRepository.update(driverId, {
      isAvailable: true,
      currentRideId: undefined,
    });
  }

  static async getDriverById(id: string): Promise<Driver | null> {
    return await DriverRepository.getById(id);
  }

  static async getDriverByUserId(userId: string): Promise<Driver | null> {
    return await DriverRepository.getByUserId(userId);
  }

  static async getAvailableDrivers(): Promise<Driver[]> {
    return await DriverRepository.findAvailableDrivers();
  }
}
