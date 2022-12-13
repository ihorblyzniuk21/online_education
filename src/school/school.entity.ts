import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'schools' })
export class SchoolEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @OneToMany(() => UserEntity, (user) => user.school, { nullable: true })
  users: UserEntity[];
}
