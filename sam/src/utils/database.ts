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

const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);

export const getItem = async (tableName: string, key: Record<string, any>) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: key,
  });
  const response = await docClient.send(command);
  return response.Item;
};

export const putItem = async (tableName: string, item: Record<string, any>) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });
  await docClient.send(command);
};

export const updateItem = async (
  tableName: string,
  key: Record<string, any>,
  updateExpression: string,
  expressionAttributeValues: Record<string, any>,
) => {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  });
  await docClient.send(command);
};

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
