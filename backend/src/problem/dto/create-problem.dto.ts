import { Research } from '../../research/research.model';

export class CreateProblemDto {
  brief: string;
  research: Research[];
  relatedExperiments: string[];
}