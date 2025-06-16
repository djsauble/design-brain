import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Research } from './research.model';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Research]),
    ],
    controllers: [ResearchController],
    providers: [ResearchService],
})

export class ResearchModule {}