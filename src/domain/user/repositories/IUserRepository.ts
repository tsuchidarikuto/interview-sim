// src/domain/user/repositories/IUserRepository.ts

import { User } from "@/domain/user/entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>; // Handles both create and update
  delete(id: string): Promise<boolean>;
  findAll?(criteria?: any): Promise<User[]>; // Optional: for listing users
}
