import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyTypes } from 'src/api-keys/decorators/api-key-types.decorator';
import { ApiKey } from 'src/api-keys/domain/api-key.entity';
import { ApiKeyGuard } from 'src/api-keys/guards/api-key.guard';
import { CreateCocktailUseCase } from 'src/cocktails/use-cases/create-cocktail.use-case';

@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly createCocktailUC: CreateCocktailUseCase) {}

  @Get('/')
  @ApiKeyTypes('write', 'read')
  @UseGuards(ApiKeyGuard)
  async listAllUserCocktails(@Req() req: Request, @Body() dto: unknown) {
    const apiKey: ApiKey = req['apikey'];
    return await this.createCocktailUC.run(apiKey.userId, dto);
  }

  @Post('/')
  @ApiKeyTypes('write')
  @UseGuards(ApiKeyGuard)
  async createNewCocktail(@Req() req: Request, @Body() dto: unknown) {
    const apiKey: ApiKey = req['apikey'];
    return await this.createCocktailUC.run(apiKey.userId, dto);
  }
}
