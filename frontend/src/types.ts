export interface Problem {
  id: number;
  brief: string;
  relatedResearch: string[];
  relatedExperiments: string[];
  isInvestigate?: boolean;
}
