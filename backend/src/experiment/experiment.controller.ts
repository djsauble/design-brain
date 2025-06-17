import { Controller, Post, Body, Param, Get, ParseIntPipe } from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { Experiment } from './experiment.model';

@Controller('problems/:problem/experiments')
export class ExperimentController {
  constructor(private readonly experimentService: ExperimentService) {}

  @Post()
  create(@Body() createExperimentDto: CreateExperimentDto) {
    return this.experimentService.create(createExperimentDto);
  }

  @Get()
  findAllForProblem(
    @Param('problem', ParseIntPipe) problem: number
  ): Promise<Experiment[]> {
    return this.experimentService.findByProblemId(problem);
  }
}