import { UserEntity } from '@app/user/user.entity';
import { GenerateTokenInterface } from '@app/token/types/generateToken.interface';

export interface UserResponseInterface {
  user: UserEntity;
  tokens: GenerateTokenInterface;
}
