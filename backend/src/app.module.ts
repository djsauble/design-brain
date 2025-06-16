import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemModule } from './problem/problem.module';
import { ResearchModule } from './research/research.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Problem } from './problem/problem.model';
import { Research } from './research/research.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [Problem, Research],
        synchronize: true,
    }),
    ProblemModule,
    ResearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
