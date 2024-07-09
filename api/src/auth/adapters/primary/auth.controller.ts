import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { SigninUserUseCase } from '../../use-cases';
import { ZodValidationPipe } from '../../../utils/pipes/zod-validation.pipe';

const signinSchema = z
  .object({
    accessToken: z.string(),
  })
  .required();

type SigninDto = z.infer<typeof signinSchema>;

@Controller('auth')
export class AuthController {
  constructor(private readonly signinUC: SigninUserUseCase) {}

  @Post('signin')
  @UsePipes(new ZodValidationPipe(signinSchema))
  async signin(@Body() { accessToken }: SigninDto) {
    const result = await this.signinUC.run(accessToken);
    if (result.isErr()) {
      return new BadRequestException();
    }

    return { token: result.unwrap() };
  }
}
