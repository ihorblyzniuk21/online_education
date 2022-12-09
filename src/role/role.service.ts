import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '@app/role/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '@app/role/dto/createRole.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async getRoleByValue(value: string): Promise<RoleEntity> {
    return await this.roleRepository.findOne({ where: { value } });
  }

  async createRole(role: CreateRoleDto): Promise<RoleEntity> {
    const roleFromDb = await this.getRoleByValue(role.value);

    if (roleFromDb) {
      throw new HttpException(
        'Role is already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newRole = new RoleEntity();
    Object.assign(newRole, role);

    return await this.roleRepository.save(newRole);
  }

  async getAllRoles(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }
}
