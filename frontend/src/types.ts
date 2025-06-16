export interface Research {
  _id: string;
  content: string;
  problem: Problem;
}

export interface Problem {
  id: number;
  brief: string;
  research: Research[];
  relatedExperiments: string[];
  isInvestigate?: boolean;
}
