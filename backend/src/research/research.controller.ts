import { Controller, Post, Body, Param, Delete, Get, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { Research } from './research.model';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/create-research.dto';

@Controller('problems/:problem/research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post()
  create(@Body() createResearchDto: CreateResearchDto) {
    return this.researchService.create(createResearchDto);
  }

  @Get()
  findAllForProblem(
    @Param('problem', ParseIntPipe) problem: number
  ): Promise<Research[]> {
    return this.researchService.findByProblemId(problem);
  }

  @Get('approved')
  findApprovedForProblem(
    @Param('problem', ParseIntPipe) problem: number
  ): Promise<Research[]> {
    return this.researchService.findApprovedByProblemId(problem);
  }

  @Delete(':researchId')
  delete(@Param('researchId') researchId: string) {
    try {
      this.researchService.remove(researchId);
      return { message: 'Research item deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}