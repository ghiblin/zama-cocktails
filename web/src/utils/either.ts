export type Left<E> = {
  _tag: "Left";
  left: E;
};

export type Right<A> = {
  _tag: "Right";
  right: A;
};

export type Either<E, A> = Left<E> | Right<A>;

export const left = <E, A = never>(e: E): Either<E, A> => ({
  _tag: "Left",
  left: e,
});
export const right = <A, E = never>(a: A): Either<E, A> => ({
  _tag: "Right",
  right: a,
});

export function isLeft<E, A>(either: Either<E, A>): either is Left<E> {
  return either._tag === "Left";
}

export function isRight<E, A>(either: Either<E, A>): either is Right<A> {
  return either._tag === "Right";
}

export function match<E, A, R>(cbs: {
  onLeft: (left: E) => R;
  onRight: (right: A) => R;
}) {
  return function (either: Either<E, A>) {
    if (isLeft(either)) {
      return cbs.onLeft(either.left);
    }
    return cbs.onRight(either.right);
  };
}
