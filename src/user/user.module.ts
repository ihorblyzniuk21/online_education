import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { TokenModule } from '@app/token/token.module';
import { TokenEntity } from '@app/token/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity]), TokenModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
