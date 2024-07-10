import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { CocktailsController } from './adapter';
import { CreateCocktailUseCase } from './use-cases/create-cocktail.use-case';
import { ListAllUserCocktailsUseCase } from './use-cases/list-all-user-cocktails.use-case';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';

@Module({
  imports: [DrizzleModule, ApiKeysModule],
  controllers: [CocktailsController],
  providers: [CreateCocktailUseCase, ListAllUserCocktailsUseCase],
  exports: [],
})
export class CocktailsModule {}
