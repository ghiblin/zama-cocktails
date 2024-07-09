/**
 * Utility class that wraps a nulluble value.
 * It's required to work together the Result class.
 */
export class Nullable<T> {
  #value: T | null;

  constructor(value: T | null = null) {
    this.#value = value;
  }

  get value(): T | null {
    return this.#value;
  }
}
