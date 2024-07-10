import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class CreateCocktailUseCase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(userId: string, dto: unknown) {
    throw new NotImplementedException();
  }
}
