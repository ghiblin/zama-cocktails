import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { z } from 'zod';
import { apiKeyType } from 'src/drizzle/schema';
import { ZodValidationPipe } from 'src/utils/pipes/zod-validation.pipe';
import { Request } from 'express';
import { CreateApiKeyUseCase } from 'src/api-keys/uses-cases/create-api-key.use-case';

const createSchema = z.object({
  type: z.enum(apiKeyType.enumValues),
});

type CreateDto = z.infer<typeof createSchema>;

@Controller('api-keys')
@UseGuards(AuthGuard)
export class ApiKeysController {
  constructor(private readonly createApiKeyUC: CreateApiKeyUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSchema))
  async createApyKey(@Body() { type }: CreateDto, @Req() req: Request) {
    const result = await this.createApiKeyUC.run(req['user']?.id, type);
    if (result.isErr()) {
      throw new BadRequestException(result.err);
    }

    return { key: result.unwrap().id };
  }
}
