import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from './experiment.model';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { Problem } from '../problem/problem.model';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectRepository(Experiment)
    private experimentRepository: Repository<Experiment>,
  ) {}

  async create(createExperimentDto: CreateExperimentDto): Promise<Experiment> {
    const newExperiment = this.experimentRepository.create(createExperimentDto);
    const savedExperiment = await this.experimentRepository.save(newExperiment);
    return savedExperiment;
  }

  async findByProblemId(problem: number): Promise<Experiment[]> {
    return this.experimentRepository.find({ where: { problem: { id: problem } } });
  }

  async findApprovedByProblemId(problem: number): Promise<Experiment[]> {
    return this.experimentRepository.find({ where: { problem: { id: problem }, isApproved: true } });
  }

  async updateIsApproved(id: string, isApproved: boolean): Promise<Experiment> {
    const experimentItem = await this.experimentRepository.findOne({ where: { id: parseInt(id, 10) } });
    if (!experimentItem) {
      throw new NotFoundException(`Experiment item with ID ${id} not found`);
    }
    experimentItem.isApproved = isApproved;
    return this.experimentRepository.save(experimentItem);
  }

  async remove(id: string): Promise<void> {
    await this.experimentRepository.delete(id);
  }
}