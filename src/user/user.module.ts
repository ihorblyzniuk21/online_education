import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { TokenModule } from '@app/token/token.module';
import { TokenEntity } from '@app/token/token.entity';
import { RoleEntity } from '@app/role/role.entity';
import { RoleModule } from '@app/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity, RoleEntity]),
    TokenModule,
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
