import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Problem } from '../problem/problem.model';

@Entity()
export class Experiment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proposal: string;

  @ManyToOne(() => Problem, (problem) => problem.experiments)
  problem: Problem;
}