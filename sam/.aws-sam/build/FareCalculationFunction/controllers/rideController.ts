import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RideService } from "../services/RideService";

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
    const { httpMethod, pathParameters, body, queryStringParameters } = event;

    /* ---------------- OPTIONS (CORS) ---------------- */
    if (httpMethod === "OPTIONS") {
      return buildResponse(200, {});
    }

    /* ---------------- POST /rides/create ---------------- */
    if (httpMethod === "POST" && pathParameters?.proxy === "create") {
      if (!body) {
        return buildResponse(400, { error: "Request body is required" });
      }

      const {
        requesterId,
        source,
        destination,
        route,
        dateTime,
        seats,
        farePerSeat,
        isShared,
        femaleOnly,
      } = JSON.parse(body);

      // Validation
      if (
        !requesterId ||
        !source ||
        !destination ||
        !route ||
        !dateTime ||
        !seats ||
        farePerSeat === undefined ||
        isShared === undefined
      ) {
        return buildResponse(400, {
          error:
            "requesterId, source, destination, route, dateTime, seats, farePerSeat, and isShared are required",
        });
      }

      if (seats < 1 || seats > 6) {
        return buildResponse(400, { error: "Seats must be between 1 and 6" });
      }

      const ride = await RideService.createRide({
        requesterId,
        source,
        destination,
        route,
        dateTime,
        seats,
        farePerSeat,
        isShared,
        femaleOnly,
      });

      return buildResponse(201, { success: true, ride });
    }

    /* ---------------- POST /rides/search-shared ---------------- */
    if (httpMethod === "POST" && pathParameters?.proxy === "search-shared") {
      if (!body) {
        return buildResponse(400, { error: "Request body is required" });
      }

      const { route, dateTime, femaleOnly } = JSON.parse(body);

      if (!route || !dateTime) {
        return buildResponse(400, {
          error: "route and dateTime are required",
        });
      }

      const rides = await RideService.searchSharedRides({
        route,
        dateTime,
        femaleOnly,
      });

      return buildResponse(200, { rides });
    }

    /* ---------------- POST /rides/join ---------------- */
    if (httpMethod === "POST" && pathParameters?.proxy === "join") {
      if (!body) {
        return buildResponse(400, { error: "Request body is required" });
      }

      const { rideId, userId } = JSON.parse(body);

      if (!rideId || !userId) {
        return buildResponse(400, {
          error: "rideId and userId are required",
        });
      }

      const ride = await RideService.joinSharedRide(rideId, userId);

      return buildResponse(200, { success: true, ride });
    }

    /* ---------------- GET /rides/{id} ---------------- */
    if (httpMethod === "GET" && pathParameters?.id) {
      const ride = await RideService.getRideById(pathParameters.id);
      if (!ride) {
        return buildResponse(404, { error: "Ride not found" });
      }

      return buildResponse(200, ride);
    }

    /* ---------------- GET /rides (by requester) ---------------- */
    if (httpMethod === "GET" && !pathParameters?.id) {
      const requesterId = queryStringParameters?.requesterId;
      if (!requesterId) {
        return buildResponse(400, {
          error: "requesterId query parameter required",
        });
      }

      const rides = await RideService.getRidesByRequester(requesterId);
      return buildResponse(200, { rides });
    }

    /* ---------------- PUT /rides/{id}/assign-driver ---------------- */
    if (
      httpMethod === "PUT" &&
      pathParameters?.id &&
      pathParameters?.proxy === "assign-driver"
    ) {
      if (!body) {
        return buildResponse(400, { error: "Request body is required" });
      }

      const { driverId } = JSON.parse(body);

      if (!driverId) {
        return buildResponse(400, { error: "driverId is required" });
      }

      await RideService.assignDriver(pathParameters.id, driverId);

      return buildResponse(200, { message: "Driver assigned successfully" });
    }

    /* ---------------- PUT /rides/{id}/start ---------------- */
    if (
      httpMethod === "PUT" &&
      pathParameters?.id &&
      pathParameters?.proxy === "start"
    ) {
      await RideService.startRide(pathParameters.id);
      return buildResponse(200, { message: "Ride started successfully" });
    }

    /* ---------------- PUT /rides/{id}/complete ---------------- */
    if (
      httpMethod === "PUT" &&
      pathParameters?.id &&
      pathParameters?.proxy === "complete"
    ) {
      await RideService.completeRide(pathParameters.id);
      return buildResponse(200, { message: "Ride completed successfully" });
    }

    /* ---------------- PUT /rides/{id}/cancel ---------------- */
    if (
      httpMethod === "PUT" &&
      pathParameters?.id &&
      pathParameters?.proxy === "cancel"
    ) {
      await RideService.cancelRide(pathParameters.id);
      return buildResponse(200, { message: "Ride cancelled successfully" });
    }

    /* ---------------- METHOD NOT ALLOWED ---------------- */
    return buildResponse(405, { error: "Method not allowed" });
  } catch (error) {
    console.error("Error in rideController:", error);
    return buildResponse(500, {
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
