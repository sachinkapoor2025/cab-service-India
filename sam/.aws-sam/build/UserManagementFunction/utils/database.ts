import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

/**
 * DynamoDB Client
 */
const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);

/**
 * Get single item by primary key
 */
export const getItem = async (tableName: string, key: Record<string, any>) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: key,
  });

  const response = await docClient.send(command);
  return response.Item;
};

/**
 * Put item (create / overwrite)
 */
export const putItem = async (tableName: string, item: Record<string, any>) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

  await docClient.send(command);
};

/**
 * Update item (safe, supports reserved keywords)
 */
export const updateItem = async (
  tableName: string,
  key: Record<string, any>,
  updateExpression: string,
  expressionAttributeValues: Record<string, any>,
  expressionAttributeNames?: Record<string, string>,
) => {
  const params: any = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  if (expressionAttributeNames) {
    params.ExpressionAttributeNames = expressionAttributeNames;
  }

  const command = new UpdateCommand(params);
  await docClient.send(command);
};

/**
 * Delete item by primary key
 */
export const deleteItem = async (
  tableName: string,
  key: Record<string, any>,
) => {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: key,
  });

  await docClient.send(command);
};

/**
 * Query items using partition key / GSI
 */
export const queryItems = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  indexName?: string,
) => {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  const response = await docClient.send(command);
  return response.Items || [];
};

/**
 * Scan table (use carefully)
 */
export const scanItems = async (
  tableName: string,
  filterExpression?: string,
  expressionAttributeValues?: Record<string, any>,
  expressionAttributeNames?: Record<string, string>,
) => {
  const params: any = {
    TableName: tableName,
  };

  if (filterExpression) {
    params.FilterExpression = filterExpression;
  }

  if (expressionAttributeValues) {
    params.ExpressionAttributeValues = expressionAttributeValues;
  }

  if (expressionAttributeNames) {
    params.ExpressionAttributeNames = expressionAttributeNames;
  }

  const command = new ScanCommand(params);
  const response = await docClient.send(command);
  return response.Items || [];
};
