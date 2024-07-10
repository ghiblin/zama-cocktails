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
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: function (config: ConfigService) {
        return {
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
    AuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
