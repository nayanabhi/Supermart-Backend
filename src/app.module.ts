import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './dto/users.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { ProductModule } from './products/product.module';
import { Products } from './dto/product.dto';
import { Sellers } from './dto/seller.dto';
import { CorsMiddleware } from './cors.middleware';


@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      ...require('../ormconfig.json'),
    }),
    TypeOrmModule.forFeature([Users, Products, Sellers]),
    JwtModule,
    AuthModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*'); // Apply CORS middleware to all routes
    consumer.apply(JwtMiddleware).exclude({ path: '/auth/(.*)', method: RequestMethod.ALL },
    { path: '/users/createUser', method: RequestMethod.POST }, { path: '/users/updatePassword', method: RequestMethod.POST }, { path: '/sellers/createSeller', method: RequestMethod.POST }).forRoutes('*'); // Apply JwtMiddleware to all routes
  }
}
