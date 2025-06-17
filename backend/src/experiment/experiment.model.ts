import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Problem } from '../problem/problem.model';

@Entity()
export class Experiment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proposal: string;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => Problem, (problem) => problem.experiments)
  problem: Problem;
}