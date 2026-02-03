import { User } from "../models/User";
import { getItem, putItem, queryItems, updateItem } from "../utils/database";

const TABLE_NAME: string = process.env.USERS_TABLE as string;

export class UserRepository {
  static async getById(id: string): Promise<User | null> {
    const item = await getItem(TABLE_NAME, { id });
    return item ? (item as User) : null;
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
}
