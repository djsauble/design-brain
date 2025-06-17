import { Controller, Post, Body, Param, Get, ParseIntPipe, Patch, Delete, NotFoundException } from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
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

  @Get('approved')
  findApprovedForProblem(
    @Param('problem', ParseIntPipe) problem: number
  ): Promise<Experiment[]> {
    return this.experimentService.findApprovedByProblemId(problem);
  }

  @Patch(':experimentId')
  update(
    @Param('experimentId') experimentId: string,
    @Body() updateExperimentDto: UpdateExperimentDto,
  ) {
    return this.experimentService.update(experimentId, updateExperimentDto);
  }

  @Delete(':experimentId')
  delete(@Param('experimentId') experimentId: string) {
    try {
      this.experimentService.remove(experimentId);
      return { message: 'Experiment item deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}