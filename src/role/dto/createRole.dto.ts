import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  readonly value: string;

  @IsNotEmpty()
  readonly description: string;
}
