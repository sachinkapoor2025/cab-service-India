import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserService } from "../services/UserService";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, pathParameters, body } = event;

    switch (httpMethod) {
      case "GET":
        if (pathParameters?.id) {
          const user = await UserService.getUserById(pathParameters.id);
          if (!user) {
            return {
              statusCode: 404,
              body: JSON.stringify({ error: "User not found" }),
            };
          }
          return {
            statusCode: 200,
            body: JSON.stringify(user),
          };
        }
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing user ID" }),
        };

      case "POST":
        if (!body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing request body" }),
          };
        }
        const { phone, name, email } = JSON.parse(body);
        if (!phone) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Phone is required" }),
          };
        }
        const user = await UserService.createUser(phone, name, email);
        return {
          statusCode: 201,
          body: JSON.stringify(user),
        };

      case "PUT":
        if (!pathParameters?.id || !body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing user ID or request body" }),
          };
        }
        const updates = JSON.parse(body);
        await UserService.updateUser(pathParameters.id, updates);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "User updated successfully" }),
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: "Method not allowed" }),
        };
    }
  } catch (error) {
    console.error("Error in userController:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
