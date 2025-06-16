import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './problem.model';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<Problem> {
    const newProblem = this.problemsRepository.create(createProblemDto);
    const savedProblem = await this.problemsRepository.save(newProblem);
    return savedProblem;
  }
  async findAll(): Promise<Problem[]> {
    return this.problemsRepository.find();
  }

  async findInvestigateProblems(): Promise<Problem[]> {
    return this.problemsRepository.find({ where: { isInvestigate: true } });
  }

  async findOne(id: number): Promise<Problem | null> {
    return this.problemsRepository.findOneBy({ id });
  }

  async update(id: number, updateProblemDto: UpdateProblemDto): Promise<Problem | null> {
    const problem = await this.problemsRepository.findOneBy({ id });
    if (!problem) {
      return null;
    }
    problem.brief = updateProblemDto.brief;
    problem.relatedResearch = updateProblemDto.relatedResearch;
    problem.relatedExperiments = updateProblemDto.relatedExperiments;
    problem.isInvestigate = updateProblemDto.isInvestigate;
    return this.problemsRepository.save(problem);
  }

  async remove(id: number): Promise<void> {
    await this.problemsRepository.delete(id);
  }
}
