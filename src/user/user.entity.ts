import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { RoleEntity } from '@app/role/role.entity';
import { SchoolEntity } from '@app/school/school.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: '' })
  dateOfBirth: string;

  @Column()
  email: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 5);
  }

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: RoleEntity[];

  @ManyToOne(() => SchoolEntity, (school) => school.users, { eager: true })
  school: SchoolEntity;
}
