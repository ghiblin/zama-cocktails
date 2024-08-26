import type { AxiosInstance } from "axios";
import axios from "axios";
import { Either, left } from "./utils/either";
import { ApiKey } from "./entities/api-key";

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
}

export const api = new API(import.meta.env.VITE_API_URL);
