import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EmergencyService } from "../services/emergencyService";

const buildResponse = (
  statusCode: number,
  body: any,
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  },
  body: JSON.stringify(body),
});

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, body } = event;

    /* ---------------- OPTIONS (CORS) ---------------- */
    if (httpMethod === "OPTIONS") {
      return buildResponse(200, {});
    }

    /* ---------------- POST /emergency/trigger ---------------- */
    if (httpMethod === "POST" && event.path === "/emergency/trigger") {
      if (!body) {
        return buildResponse(400, { error: "Request body is required" });
      }

      const { userId, rideId, emergencyContacts, latitude, longitude } =
        JSON.parse(body);

      // Validation
      if (!userId || !rideId) {
        return buildResponse(400, {
          error: "userId and rideId are required",
        });
      }

      if (!emergencyContacts || emergencyContacts.length < 2) {
        return buildResponse(400, {
          error: "At least 2 emergency contacts required",
        });
      }

      // Validate emergency contacts format
      for (const contact of emergencyContacts) {
        if (!contact || typeof contact !== "string") {
          return buildResponse(400, {
            error: "All emergency contacts must be valid strings",
          });
        }
      }

      // Validate coordinates if provided
      if (
        (latitude !== undefined && typeof latitude !== "number") ||
        (longitude !== undefined && typeof longitude !== "number")
      ) {
        return buildResponse(400, {
          error: "latitude and longitude must be numbers if provided",
        });
      }

      await EmergencyService.sendEmergencyAlert({
        userId,
        rideId,
        emergencyContacts,
        latitude,
        longitude,
      });

      return buildResponse(200, {
        success: true,
        message: "Emergency alert sent successfully",
      });
    }

    /* ---------------- METHOD NOT ALLOWED ---------------- */
    return buildResponse(405, { error: "Method not allowed" });
  } catch (error) {
    console.error("Error in emergencyController:", error);
    return buildResponse(500, {
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
