import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from '@app/token/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
