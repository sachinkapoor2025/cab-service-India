import { Ride, RideStatus } from "../models/Ride";
import {
  getItem,
  putItem,
  queryItems,
  updateItem,
  scanItems,
} from "../utils/database";

const TABLE_NAME = process.env.RIDES_TABLE!;

export class RideRepository {
  static async getById(id: string): Promise<Ride | null> {
    const item = await getItem(TABLE_NAME, { id });
    return (item as Ride) || null;
  }

  static async create(ride: Ride): Promise<void> {
    await putItem(TABLE_NAME, ride);
  }

  static async update(id: string, updates: Partial<Ride>): Promise<void> {
    if (!updates || Object.keys(updates).length === 0) {
      return;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

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

    await updateItem(
      TABLE_NAME,
      { id },
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames,
    );
  }

  static async findMatchingSharedRides(
    route: string,
    dateTime: string,
    maxDistance: number = 3600000, // 1 hour window
  ): Promise<Ride[]> {
    // Query by route and dateTime range using RouteDateIndex
    const startTime = new Date(dateTime).getTime() - maxDistance;
    const endTime = new Date(dateTime).getTime() + maxDistance;

    const startTimeStr = new Date(startTime).toISOString();
    const endTimeStr = new Date(endTime).toISOString();

    const items = await queryItems(
      TABLE_NAME,
      "route = :route AND dateTime BETWEEN :start AND :end",
      {
        ":route": route,
        ":start": startTimeStr,
        ":end": endTimeStr,
      },
      "RouteDateIndex",
    );

    // Filter for shared rides that are waiting for match and have available seats
    return (items as Ride[]).filter(
      (ride) =>
        ride.isShared &&
        ride.status === "WAITING_FOR_MATCH" &&
        ride.availableSeats > 0,
    );
  }

  static async getRidesByDriver(driverId: string): Promise<Ride[]> {
    const items = await queryItems(
      TABLE_NAME,
      "driverId = :driverId",
      { ":driverId": driverId },
      "DriverIndex",
    );
    return items as Ride[];
  }

  static async getRidesByRequester(requesterId: string): Promise<Ride[]> {
    const items = await queryItems(
      TABLE_NAME,
      "requesterId = :requesterId",
      { ":requesterId": requesterId },
      "RequesterIndex",
    );
    return items as Ride[];
  }

  static async getAllRides(): Promise<Ride[]> {
    const items = await scanItems(TABLE_NAME);
    return items as Ride[];
  }
}
