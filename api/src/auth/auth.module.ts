import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import UserModule from '../user/user.module';
import { SigninUserUseCase } from './use-cases';
import { AxiosGoogleAdapter } from './adapters/secondary/axios-google.adapter';
import { AuthController } from './adapters/primary/auth.controller';
import {
  GOOGLE_ADAPTER,
  GoogleRepository,
} from './repositories/google.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: function (config: ConfigService) {
        return {
          global: true,
          secret: config.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: config.get<string>('jwt.expiresIn') ?? '1h',
          },
        };
      },
    }),
  ],
  providers: [
    SigninUserUseCase,
    GoogleRepository,
    {
      provide: GOOGLE_ADAPTER,
      useClass: AxiosGoogleAdapter,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
