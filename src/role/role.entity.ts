import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  value: string;

  @Column()
  description: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
