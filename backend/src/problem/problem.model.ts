import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brief: string;

  @Column('simple-array', { nullable: true })
  relatedResearch: string[];

  @Column('simple-array', { nullable: true })
  relatedExperiments: string[];
}
