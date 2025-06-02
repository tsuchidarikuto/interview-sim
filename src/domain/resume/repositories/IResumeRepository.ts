// src/domain/resume/repositories/IResumeRepository.ts

import { Resume, ResumeStatus } from "@/domain/resume/entities/Resume";

export interface FindResumesCriteria {
  candidateId?: string;
  status?: ResumeStatus;
  uploadedAfter?: Date;
}

export interface IResumeRepository {
  findById(id: string): Promise<Resume | null>;
  findByCandidateId(candidateId: string): Promise<Resume[]>;
  save(resume: Resume): Promise<Resume>; // Handles create and update
  delete(id: string): Promise<boolean>;
  findAll(criteria: FindResumesCriteria): Promise<Resume[]>;
  // Potentially methods to update specific fields like status or parsedData
  updateStatus(id: string, status: ResumeStatus): Promise<Resume | null>;
  updateParsedData(id: string, parsedData: any, status?: ResumeStatus): Promise<Resume | null>;
}
