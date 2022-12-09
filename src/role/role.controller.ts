import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from '@app/role/role.service';
import { CreateRoleDto } from '@app/role/dto/createRole.dto';
import { RoleEntity } from '@app/role/role.entity';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAllRoles(): Promise<RoleEntity[]> {
    return await this.roleService.getAllRoles();
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return await this.roleService.createRole(createRoleDto);
  }
}
