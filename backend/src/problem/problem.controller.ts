import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { Problem } from './problem.model';

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  create(@Body() createProblemDto: { brief: string }): Promise<Problem> {
    return this.problemService.create(createProblemDto);
  }
}
