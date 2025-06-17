export interface Research {
  id: string;
  content: string;
  problem: Problem;
  isApproved?: boolean;
}

export interface Problem {
  id: number;
  brief: string;
  research: Research[];
  relatedExperiments: string[];
  isInvestigate?: boolean;
}

export interface Experiment {
  id: number;
  proposal: string;
  problem: Problem;
  isApproved?: boolean;
}
