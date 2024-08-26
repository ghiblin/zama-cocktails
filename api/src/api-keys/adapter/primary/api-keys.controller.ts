import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
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
import { FindApiKeyByIdUseCase } from 'src/api-keys/uses-cases/find-api-key-by-id.use-case';
import { NotFoundError } from 'src/utils/errors';

const createSchema = z.object({
  type: z.enum(apiKeyType.enumValues),
});

type CreateDto = z.infer<typeof createSchema>;

@Controller('api-keys')
@UseGuards(AuthGuard)
export class ApiKeysController {
  constructor(
    private readonly createApiKeyUC: CreateApiKeyUseCase,
    private readonly findApiKeyById: FindApiKeyByIdUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSchema))
  async createApyKey(@Body() { type }: CreateDto, @Req() req: Request) {
    const result = await this.createApiKeyUC.run(req['user']?.id, type);
    if (result.isErr()) {
      throw new BadRequestException(result.err);
    }

    return { key: result.unwrap().id };
  }

  @Get(':id')
  async getApiKeyById(@Param('id') id: string) {
    const result = await this.findApiKeyById.run(id);
    if (result.isErr()) {
      if (result.err instanceof NotFoundError) {
        throw new NotFoundException(result.err.message);
      }
      return new InternalServerErrorException('Something bad happened', {
        cause: result.err,
      });
    }
    return result.unwrap();
  }
}
