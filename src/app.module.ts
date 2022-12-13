import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormconfig from '@app/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { RoleModule } from './role/role.module';
import { SchoolModule } from './school/school.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({ envFilePath: '.development.env' }),
    UserModule,
    TokenModule,
    RoleModule,
    SchoolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
