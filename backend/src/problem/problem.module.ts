import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './problem.model';
import { ProblemController } from './problem.controller'
import { ProblemService } from './problem.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Problem]),
    ],
    controllers: [ProblemController],
    providers: [ProblemService],
})

export class ProblemModule {}