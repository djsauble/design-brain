import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brief: string;
}
