import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Essay } from './essay.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @OneToOne(() => Essay, (essay) => essay.user, { cascade: true })
  essay: Essay;
}
