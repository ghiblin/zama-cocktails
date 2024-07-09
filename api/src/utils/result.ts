/**
 * Utility class inspired by the Rust Result enum.
 *
 * Modern languages like Rust and Go do not support exceptions,
 * and force the developer to explicitly handle the errors.
 */
export class Result<T, E extends Error = Error> {
  #ok: T | null = null;
  #err: E | null = null;

  constructor(ok: T | null, err: E | null) {
    if (ok === null && err === null) {
      throw new Error('Result must have a value or an error');
    }
    if (ok !== null && err !== null) {
      throw new Error('Result cannot have both a value and and error');
    }

    if (ok !== null) {
      this.#ok = ok;
    } else {
      this.#err = err as E;
    }
  }

  /**
   * Check if the result is ok
   *
   * @returns if the result is ok
   */
  isOk(): this is Result<T, never> {
    return this.#ok !== null;
  }

  /**
   * Check if the result is an error
   *
   * @returns if the result is an error
   */
  isErr(): this is Result<never, E> {
    return this.#err !== null;
  }

  /**
   * Unwrap the content of the result. In case
   * of an error, it throws it
   *
   * @returns the result's value
   */
  unwrap(): T {
    if (this.isOk()) {
      return this.#ok as T;
    }

    if (this.isErr()) {
      throw this.#err as E;
    }

    throw new Error('Unknown error');
  }

  /**
   * It unwrap the content of the result, and in case
   * of an error, it fires a custom error message.
   *
   * @param msg the message to be thrown in case of error
   * @returns the result's value
   */
  expect(msg: string): T {
    if (this.isOk()) {
      return this.#ok as T;
    }

    throw new Error(msg);
  }

  get err(): this extends Result<never, E> ? E : E | null {
    return this.#err as E;
  }
}
