// src/domain/company/repositories/ICompanyRepository.ts

import { Company } from "@/domain/company/entities/Company";

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findByName(name: string): Promise<Company[] | null>; // Name might not be unique
  save(company: Company): Promise<Company>; // Handles both create and update
  delete(id: string): Promise<boolean>;
  findAll?(criteria?: any): Promise<Company[]>;
}
