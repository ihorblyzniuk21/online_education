import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateRoleDto } from '@app/role/dto/createRole.dto';

export class CreateUserDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly roles: CreateRoleDto[];

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
