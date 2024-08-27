import type { AxiosInstance } from "axios";
import axios from "axios";
import { Either, left, match } from "./utils/either";
import { ApiKey } from "./entities/api-key";
import { Cocktail, NewCocktailProps } from "./entities/cocktail";
import { getApiKey } from "./components/context/auth.context";

class API {
  #client: AxiosInstance;

  constructor(baseURL: string) {
    this.#client = axios.create({ baseURL });
  }

  async fetchApiKey(key: string): Promise<Either<string, ApiKey>> {
    try {
      const resp = await this.#client.get<unknown>(`/api-keys/${key}`);
      if (resp.status !== 200) {
        return left(`Failed to fetch key ${key}`);
      }
      return ApiKey.parse(resp.data);
    } catch (e) {
      return left(String(e));
    }
  }

  async createCocktail(
    props: NewCocktailProps
  ): Promise<Either<string, Cocktail>> {
    try {
      const resp = await this.#client.post<unknown>(`/cocktails`, props, {
        headers: {
          Authorization: match<string, ApiKey, string>({
            onLeft: () => "",
            onRight: (key) => key.id,
          })(getApiKey()),
        },
      });
      if (resp.status !== 201) {
        return left(`Failed to create cocktail`);
      }
      return Cocktail.parse(resp.data);
    } catch (e) {
      return left(String(e));
    }
  }
}

export const api = new API(import.meta.env.VITE_API_URL);
