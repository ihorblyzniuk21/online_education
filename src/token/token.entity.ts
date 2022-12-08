import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'tokens' })
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  refreshToken: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
