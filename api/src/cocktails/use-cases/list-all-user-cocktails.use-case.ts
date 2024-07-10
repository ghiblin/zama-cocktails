import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class ListAllUserCocktailsUseCase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(userId: string) {
    throw new NotImplementedException();
  }
}
