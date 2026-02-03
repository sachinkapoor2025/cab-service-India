import axios from "axios";
import { API_BASE_URL } from "../config";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

// User API
export const userApi = {
  createUser: (data: {
    phone: string;
    role: "STUDENT" | "DRIVER";
    name?: string;
    email?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
  }) => api.post("/users", data),

  getUser: (id: string) => api.get(`/users/${id}`),

  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),

  updateEmergencyContacts: (id: string, contacts: string[]) =>
    api.put(`/users/${id}`, { emergencyContacts: contacts }),
};

// Ride API
export const rideApi = {
  createRide: (data: {
    requesterId: string;
    source: string;
    destination: string;
    route: string;
    dateTime: string;
    seats: number;
    farePerSeat: number;
    isShared: boolean;
    femaleOnly?: boolean;
  }) => api.post("/rides/create", data),

  searchSharedRides: (data: {
    route: string;
    dateTime: string;
    femaleOnly?: boolean;
  }) => api.post("/rides/search-shared", data),

  joinSharedRide: (data: { rideId: string; userId: string }) =>
    api.post("/rides/join", data),

  getRide: (id: string) => api.get(`/rides/${id}`),

  getUserRides: (requesterId: string) =>
    api.get("/rides", { params: { requesterId } }),

  assignDriver: (rideId: string, driverId: string) =>
    api.put(`/rides/${rideId}/assign-driver`, { driverId }),

  startRide: (rideId: string) => api.put(`/rides/${rideId}/start`),

  completeRide: (rideId: string) => api.put(`/rides/${rideId}/complete`),

  cancelRide: (rideId: string) => api.put(`/rides/${rideId}/cancel`),
};

// Driver API
export const driverApi = {
  createDriver: (data: {
    phone: string;
    name: string;
    email?: string;
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
  }) => api.post("/drivers", data),

  getDriver: (id: string) => api.get(`/drivers/${id}`),

  updateDriver: (id: string, data: any) => api.put(`/drivers/${id}`, data),

  updateDocuments: (id: string, documents: any) =>
    api.put(`/drivers/${id}/documents`, documents),

  setAvailability: (id: string, isAvailable: boolean) =>
    api.put(`/drivers/${id}/availability`, { isAvailable }),

  getAvailableDrivers: () => api.get("/drivers/available"),

  updateRating: (id: string, rating: number) =>
    api.put(`/drivers/${id}/rating`, { rating }),
};

// Emergency API
export const emergencyApi = {
  sendAlert: (data: {
    userId: string;
    rideId?: string;
    customMessage?: string;
    location?: { lat: number; lng: number };
  }) => api.post("/emergency", data),
};

// Booking API (if needed)
export const bookingApi = {
  createBooking: (data: any) => api.post("/bookings", data),
  getBooking: (id: string) => api.get(`/bookings/${id}`),
  updateBooking: (id: string, data: any) => api.put(`/bookings/${id}`, data),
};

export default api;
