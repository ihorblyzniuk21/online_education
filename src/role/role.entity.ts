import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  value: string;

  @Column()
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
