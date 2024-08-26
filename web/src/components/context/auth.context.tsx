import { api } from "@/api";
import { User } from "@/entities/user";
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
type UserState = { _tag: "User"; user: User };

export type AuthState = NullState | ErrorState | UserState;

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
type KeyFetched = { type: "KeyFetched"; payload: User };
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
      return { _tag: "User", user: action.payload };
    default:
      return state;
  }
}

export const AuuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, InitialState);

  useEffect(() => {
    match<string, User, void>({
      onLeft: (msg) => {
        console.log(`invalid key: ${msg}`);
        dispatch({ type: "Reset" });
      },
      onRight: (user) => dispatch({ type: "KeyFetched", payload: user }),
    })(User.parse(localStorage.getItem(AUTH_ITEM)));
  }, []);

  const checkKey = useCallback((key: string) => {
    async function fetchApi(key: string) {
      dispatch({ type: "FetchKey" });
      const resp = await api.fetchApiKey(key);
      match<string, User, void>({
        onLeft: (msg) => {
          dispatch({ type: "KeyFailed", payload: msg });
        },
        onRight: (user) => {
          dispatch({ type: "KeyFetched", payload: user });
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
