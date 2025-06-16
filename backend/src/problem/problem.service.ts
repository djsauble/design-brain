import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './problem.model';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>
  ) {}

  async create(createProblemDto: { brief: string }): Promise<Problem> {
    const newProblem = this.problemsRepository.create(createProblemDto);
    const savedProblem = await this.problemsRepository.save(newProblem);
    return savedProblem;
  }
  async findAll(): Promise<Problem[]> {
    return this.problemsRepository.find();
  }
  async findOne(id: number): Promise<Problem | null> {
    return this.problemsRepository.findOneBy({ id });
  }

  async update(id: number, updateProblemDto: { brief: string }): Promise<Problem | null> {
    const problem = await this.problemsRepository.findOneBy({ id });
    if (!problem) {
      return null;
    }
    problem.brief = updateProblemDto.brief;
    return this.problemsRepository.save(problem);
  }

  async remove(id: number): Promise<void> {
    await this.problemsRepository.delete(id);
  }
}
