import { Axios } from "axios";
import { Either, left } from "./utils/either";
import { User } from "./entities/user";

class API {
  #client: Axios;

  constructor(baseURL: string) {
    this.#client = new Axios({ baseURL });
  }

  async fetchApiKey(key: string): Promise<Either<string, User>> {
    try {
      const resp = await this.#client.get<unknown>(`/api-keys/${key}`);
      if (resp.status !== 200) {
        return left(`Failed to fetch key ${key}`);
      }
      return User.parse(resp.data);
    } catch (e) {
      return left(String(e));
    }
  }
}

export const api = new API(import.meta.env.VITE_API_URL);
