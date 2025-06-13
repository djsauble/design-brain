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
    return this.problemsRepository.create(createProblemDto);
  }
  async findAll(): Promise<Problem[]> {
    return this.problemsRepository.find();
  }
}
