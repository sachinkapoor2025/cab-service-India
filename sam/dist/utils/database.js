"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanItems = exports.queryItems = exports.deleteItem = exports.updateItem = exports.putItem = exports.getItem = exports.docClient = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
/**
 * DynamoDB Client
 */
const client = new client_dynamodb_1.DynamoDBClient({});
exports.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
/**
 * Get single item by primary key
 */
const getItem = async (tableName, key) => {
    const command = new lib_dynamodb_1.GetCommand({
        TableName: tableName,
        Key: key,
    });
    const response = await exports.docClient.send(command);
    return response.Item;
};
exports.getItem = getItem;
/**
 * Put item (create / overwrite)
 */
const putItem = async (tableName, item) => {
    const command = new lib_dynamodb_1.PutCommand({
        TableName: tableName,
        Item: item,
    });
    await exports.docClient.send(command);
};
exports.putItem = putItem;
/**
 * Update item (safe, supports reserved keywords)
 */
const updateItem = async (tableName, key, updateExpression, expressionAttributeValues, expressionAttributeNames) => {
    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
    };
    if (expressionAttributeNames) {
        params.ExpressionAttributeNames = expressionAttributeNames;
    }
    const command = new lib_dynamodb_1.UpdateCommand(params);
    await exports.docClient.send(command);
};
exports.updateItem = updateItem;
/**
 * Delete item by primary key
 */
const deleteItem = async (tableName, key) => {
    const command = new lib_dynamodb_1.DeleteCommand({
        TableName: tableName,
        Key: key,
    });
    await exports.docClient.send(command);
};
exports.deleteItem = deleteItem;
/**
 * Query items using partition key / GSI
 */
const queryItems = async (tableName, keyConditionExpression, expressionAttributeValues, indexName) => {
    const command = new lib_dynamodb_1.QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
    });
    const response = await exports.docClient.send(command);
    return response.Items || [];
};
exports.queryItems = queryItems;
/**
 * Scan table (use carefully)
 */
const scanItems = async (tableName, filterExpression, expressionAttributeValues, expressionAttributeNames) => {
    const params = {
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
    const command = new lib_dynamodb_1.ScanCommand(params);
    const response = await exports.docClient.send(command);
    return response.Items || [];
};
exports.scanItems = scanItems;
