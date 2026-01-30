import { Driver } from "../models/Driver";
import { getItem, putItem, queryItems, updateItem } from "../utils/database";

const TABLE_NAME = process.env.DRIVERS_TABLE!;

export class DriverRepository {
  static async getById(id: string): Promise<Driver | null> {
    const item = await getItem(TABLE_NAME, { id });
    return (item as Driver) || null;
  }

  static async getByPhone(phone: string): Promise<Driver | null> {
    const items = await queryItems(
      TABLE_NAME,
      "phone = :phone",
      { ":phone": phone },
      "PhoneIndex",
    );
    return items.length > 0 ? (items[0] as Driver) : null;
  }

  static async create(driver: Driver): Promise<void> {
    await putItem(TABLE_NAME, driver);
  }

  static async update(id: string, updates: Partial<Driver>): Promise<void> {
    const updateExpression =
      "SET " +
      Object.keys(updates)
        .map((key, index) => `${key} = :val${index}`)
        .join(", ");
    const expressionAttributeValues = Object.keys(updates).reduce(
      (acc, key, index) => {
        acc[`:val${index}`] = updates[key as keyof Driver];
        return acc;
      },
      {} as Record<string, any>,
    );
    await updateItem(
      TABLE_NAME,
      { id },
      updateExpression,
      expressionAttributeValues,
    );
  }
}
