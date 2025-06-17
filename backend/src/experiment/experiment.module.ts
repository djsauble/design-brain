import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './experiment.model';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Experiment]),
    ],
    controllers: [ExperimentController],
    providers: [ExperimentService],
})

export class ExperimentModule {}