// src/domain/resume/services/ResumeAnalysisService.ts

import { Resume, ResumeStatus } from "@/domain/resume/entities/Resume";

// This interface could define the structure of the analysis result
export interface ResumeAnalysisResult {
  extractedSkills: string[];
  keywordDensity: Map<string, number>; // e.g., "JavaScript" -> 5
  overallSentiment?: "positive" | "neutral" | "negative"; // If we did sentiment analysis
  // Add more fields as analysis capabilities grow
}

// This could be an interface for a more complex parsing/analysis tool/port
export interface ResumeParsingProvider {
  parse(textContent: string): Promise<Partial<ResumeAnalysisResult>>;
}

export class ResumeAnalysisService {
  private parsingProvider?: ResumeParsingProvider;

  // Optionally inject a parsing provider if complex parsing is needed
  constructor(parsingProvider?: ResumeParsingProvider) {
    this.parsingProvider = parsingProvider;
  }

  // Basic keyword extraction (example)
  public extractKeywords(resume: Resume, keywords: string[]): string[] {
    if (!resume.textContent) {
      return [];
    }
    const foundKeywords: string[] = [];
    const lowerCaseText = resume.textContent.toLowerCase();

    for (const keyword of keywords) {
      if (lowerCaseText.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    }
    return foundKeywords;
  }

  // A more complex analysis method that might use the provider
  public async performFullAnalysis(resume: Resume): Promise<ResumeAnalysisResult> {
    if (resume.status === ResumeStatus.PARSING_FAILED || !resume.textContent) {
      throw new Error("Resume is not suitable for analysis or lacks text content.");
    }

    let analysisResult: ResumeAnalysisResult = {
      extractedSkills: [],
      keywordDensity: new Map(),
    };

    // If a parsing provider is available, use it
    if (this.parsingProvider && resume.textContent) {
      const providerResult = await this.parsingProvider.parse(resume.textContent);
      analysisResult = { ...analysisResult, ...providerResult };
    } else if (resume.textContent) {
      // Fallback to basic internal analysis if no provider
      // This is just a placeholder for more sophisticated local parsing logic
      const skills = this.extractKeywords(resume, ["JavaScript", "TypeScript", "React", "Node.js", "DDD"]);
      analysisResult.extractedSkills = skills;
      // Populate keywordDensity (simplified)
      skills.forEach(skill => analysisResult.keywordDensity.set(skill, (analysisResult.keywordDensity.get(skill) || 0) + 1));
    }

    // Here, you might also update the resume entity's `parsedData` field
    // or emit a Domain Event e.g., ResumeAnalyzed
    return analysisResult;
  }

  // Other methods could include:
  // - compareResumeToJobDescription(resume: Resume, jobDescription: string): MatchScore
  // - identifyYearsOfExperience(resume: Resume, technology: string): number
}
