import { Research } from '../../research/research.model';

export class UpdateProblemDto {
  brief: string;
  research: Research[];
  relatedExperiments: string[];
  isInvestigate: boolean;
}