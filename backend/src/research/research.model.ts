import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Problem } from '../problem/problem.model';

@Entity()
export class Research {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Problem, (problem) => problem.research)
  problem: Problem;
}
