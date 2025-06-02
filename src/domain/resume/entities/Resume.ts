// src/domain/resume/entities/Resume.ts

export enum ResumeStatus {
  PENDING_PARSING = "pending_parsing",
  PARSED = "parsed",
  PARSING_FAILED = "parsing_failed",
}

export interface Resume {
  id: string; // Unique identifier for the resume
  candidateId: string; // ID of the candidate (references User entity)
  fileName: string; // Original file name of the uploaded resume
  filePath?: string; // Path to the stored resume file (e.g., in cloud storage)
  fileUrl?: string; // URL to access the resume file
  textContent?: string; // Extracted text content from parsing
  parsedData?: any; // Structured data extracted from the resume (e.g., skills, experience)
  status: ResumeStatus; // Current status of the resume
  uploadedAt: Date;
  updatedAt: Date;
}
