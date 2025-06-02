// src/domain/company/entities/Company.ts

export interface Company {
  id: string; // Unique identifier
  name: string; // Company name
  description?: string; // Optional company description
  website?: string; // Optional company website URL
  createdAt: Date;
  updatedAt: Date;
}
