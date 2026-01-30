import { User } from "../models/User";
import { getItem, putItem, queryItems, updateItem } from "../utils/database";

const TABLE_NAME = process.env.USERS_TABLE!;

export class UserRepository {
  static async getById(id: string): Promise<User | null> {
    const item = await getItem(TABLE_NAME, { id });
    return (item as User) || null;
  }

  static async getByPhone(phone: string): Promise<User | null> {
    const items = await queryItems(
      TABLE_NAME,
      "phone = :phone",
      { ":phone": phone },
      "PhoneIndex",
    );
    return items.length > 0 ? (items[0] as User) : null;
  }

  static async create(user: User): Promise<void> {
    await putItem(TABLE_NAME, user);
  }

  static async update(id: string, updates: Partial<User>): Promise<void> {
    const updateExpression =
      "SET " +
      Object.keys(updates)
        .map((key, index) => `${key} = :val${index}`)
        .join(", ");
    const expressionAttributeValues = Object.keys(updates).reduce(
      (acc, key, index) => {
        acc[`:val${index}`] = updates[key as keyof User];
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
