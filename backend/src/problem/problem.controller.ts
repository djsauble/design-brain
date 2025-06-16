import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { Problem } from './problem.model';

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  create(@Body() createProblemDto: { brief: string }): Promise<Problem> {
    return this.problemService.create(createProblemDto);
  }

  @Get()
  findAll(): Promise<Problem[]> {
    return this.problemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Problem> {
    const problem = await this.problemService.findOne(id);
    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    return problem;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProblemDto: { brief: string }): Promise<Problem> {
    const problem = await this.problemService.update(id, updateProblemDto);
    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    return problem;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const problem = await this.problemService.findOne(id);
    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    await this.problemService.remove(id);
  }
}
