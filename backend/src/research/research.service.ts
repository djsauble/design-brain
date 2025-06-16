import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegerType, Repository } from 'typeorm';
import { Research } from './research.model';
import { CreateResearchDto } from './dto/create-research.dto';

@Injectable()
export class ResearchService {
  constructor(
    @InjectRepository(Research)
    private researchRepository: Repository<Research>,
  ) {}

  async create(createResearchDto: CreateResearchDto): Promise<Research> {
    const newResearch = this.researchRepository.create(createResearchDto);
    const savedResearch = await this.researchRepository.save(newResearch);
    return savedResearch;
  }

  async findByProblemId(problemId: number): Promise<Research[]> {
    return this.researchRepository.find({ where: { problem: { id: problemId } } })
  }

  async remove(id: string): Promise<void> {
    await this.researchRepository.delete(id);
  }
}