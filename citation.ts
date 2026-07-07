export interface SourceValidationReport {
  overallScore: number;
  credibilityRating: 'Low' | 'Medium' | 'High';
  potentialIssues: string[];
  recommendedSources: ScholarlyReference[];
}

export interface CitationStyle {
  name: 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE';
  version: string;
}

export interface ScholarlyReference {
  id: string;
  title: string;
  authors: string[];
  publicationDate: Date;
  doi?: string;
  url?: string;
  citationText: string;
  credibilityScore?: number;
}

export interface CitationGenerationResult {
  citations: ScholarlyReference[];
  bibliography: string;
  validationReport: SourceValidationReport;
}
