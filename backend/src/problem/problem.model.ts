import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Research } from '../research/research.model';
import { Experiment } from '../experiment/experiment.model';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brief: string;

  @Column('simple-array', { nullable: true })
  relatedExperiments: string[];

  @Column({ default: false })
  isInvestigate: boolean;

  @OneToMany(() => Research, (research) => research.problem)
  research: Research[];

  @OneToMany(() => Experiment, (experiment) => experiment.problem)
  experiments: Experiment[];
}
