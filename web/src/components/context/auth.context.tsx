import { api } from "@/api";
import { ApiKey } from "@/entities/api-key";
import { match } from "@/utils/either";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";

const AUTH_ITEM = "__auth__";

type NullState = { _tag: "Null"; fetching: boolean };
type ErrorState = { _tag: "Error"; message: string };
type ValidKeyState = { _tag: "ValidKey"; key: ApiKey };

export type AuthState = NullState | ErrorState | ValidKeyState;

export type Auth = {
  state: AuthState;
  checkKey: (key: string) => void;
};

const InitialState = { _tag: "Null", fetching: false } satisfies AuthState;

export const AuthContext = createContext<Auth>({
  state: InitialState,
  checkKey: () => {},
});

type Reset = { type: "Reset" };
type FetchKey = { type: "FetchKey" };
type KeyFetched = { type: "KeyFetched"; payload: ApiKey };
type KeyFailed = { type: "KeyFailed"; payload: string };
type AuthAction = Reset | FetchKey | KeyFetched | KeyFailed;

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "Reset":
      return InitialState;
    case "FetchKey":
      return { _tag: "Null", fetching: true };
    case "KeyFailed":
      return { _tag: "Error", message: action.payload };
    case "KeyFetched":
      return { _tag: "ValidKey", key: action.payload };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, InitialState);

  useEffect(() => {
    try {
      const item = localStorage.getItem(AUTH_ITEM);
      if (item !== null) {
        match<string, ApiKey, void>({
          onLeft: (msg) => {
            console.log(`invalid key: ${msg}`);
            dispatch({ type: "Reset" });
          },
          onRight: (key) => dispatch({ type: "KeyFetched", payload: key }),
        })(ApiKey.parse(JSON.parse(item)));
      }
    } catch (e) {
      console.log(`failed to restore api key: ${e}`);
    }
  }, []);

  useEffect(() => {
    if (state._tag === "ValidKey") {
      console.log(`storing api key into local storage`);
      localStorage.setItem(AUTH_ITEM, JSON.stringify(state.key.toJSON()));
    }
  }, [state]);

  const checkKey = useCallback((key: string) => {
    async function fetchApi(key: string) {
      dispatch({ type: "FetchKey" });
      const resp = await api.fetchApiKey(key);
      match<string, ApiKey, void>({
        onLeft: (msg) => {
          dispatch({ type: "KeyFailed", payload: msg });
        },
        onRight: (key) => {
          dispatch({ type: "KeyFetched", payload: key });
        },
      })(resp);
    }
    fetchApi(key);
  }, []);

  return (
    <AuthContext.Provider value={{ state, checkKey }}>
      {children}
    </AuthContext.Provider>
  );
};
