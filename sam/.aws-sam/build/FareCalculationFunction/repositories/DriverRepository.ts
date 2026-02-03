import { Driver } from "../models/Driver";
import {
  getItem,
  putItem,
  queryItems,
  updateItem,
  scanItems,
} from "../utils/database";

const TABLE_NAME = process.env.DRIVERS_TABLE!;

export class DriverRepository {
  static async getById(id: string): Promise<Driver | null> {
    const item = await getItem(TABLE_NAME, { id });
    return (item as Driver) || null;
  }

  static async getByUserId(userId: string): Promise<Driver | null> {
    const items = await queryItems(
      TABLE_NAME,
      "userId = :userId",
      { ":userId": userId },
      "UserIndex",
    );
    return items.length > 0 ? (items[0] as Driver) : null;
  }

  static async create(driver: Driver): Promise<void> {
    await putItem(TABLE_NAME, driver);
  }

  static async update(id: string, updates: Partial<Driver>): Promise<void> {
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

  static async findAvailableDrivers(): Promise<Driver[]> {
    const items = await scanItems(TABLE_NAME);
    return (items as Driver[]).filter(
      (driver) => driver.isActive && driver.isAvailable,
    );
  }
}
