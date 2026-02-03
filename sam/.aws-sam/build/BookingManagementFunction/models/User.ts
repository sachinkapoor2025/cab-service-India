export type UserRole = "STUDENT" | "DRIVER" | "ADMIN";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;

  // Auth / Identity
  phone: string;
  email?: string;
  name?: string;

  // Role-based access
  role: UserRole;

  // For female-only rides & safety
  gender?: Gender;

  // Emergency feature
  emergencyContacts?: string[]; // exactly 2 numbers expected

  // Metadata
  createdAt: string;
  updatedAt: string;
}
