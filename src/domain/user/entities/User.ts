// src/domain/user/entities/User.ts

export interface User {
  id: string; // Unique identifier
  email: string; // Email address, should be unique
  name?: string; // Optional display name
  roles: UserRole[]; // User roles within the system
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CANDIDATE = "candidate",
  INTERVIEWER = "interviewer",
  ADMIN = "admin",
}
