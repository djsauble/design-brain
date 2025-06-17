import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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

  async findByProblemId(problem: number): Promise<Research[]> {
    return this.researchRepository.find({ where: { problem: { id: problem } } })
  }

  async findApprovedByProblemId(problem: number): Promise<Research[]> {
    return this.researchRepository.find({ where: { problem: { id: problem }, isApproved: true } });
  }

  async updateIsApproved(id: string, isApproved: boolean): Promise<Research> {
    const researchItem = await this.researchRepository.findOne({ where: { id: parseInt(id, 10) } });
    if (!researchItem) {
      throw new NotFoundException(`Research item with ID ${id} not found`);
    }
    researchItem.isApproved = isApproved;
    return this.researchRepository.save(researchItem);
  }

  async remove(id: string): Promise<void> {
    await this.researchRepository.delete(id);
  }
}