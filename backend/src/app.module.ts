import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemModule } from './problem/problem.module';
import { ResearchModule } from './research/research.module';
import { ExperimentModule } from './experiment/experiment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Problem } from './problem/problem.model';
import { Research } from './research/research.model';
import { Experiment } from './experiment/experiment.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [Problem, Research, Experiment],
        synchronize: true,
    }),
    ProblemModule,
    ResearchModule,
    ExperimentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
