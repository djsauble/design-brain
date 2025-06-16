import { Module } from '@nestjs/common';
import { ProblemModule } from './problem/problem.module';
import { ResearchModule } from './research/research.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ProblemModule,
    ResearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
