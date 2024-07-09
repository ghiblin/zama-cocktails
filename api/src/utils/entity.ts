export abstract class Entity<Props> {
  #props: Props;

  protected constructor(props: Props) {
    this.#props = props;
  }

  protected get<K extends keyof Props>(key: K): Props[K] {
    return this.#props[key];
  }

  toJSON(): Props {
    // Deep-clone our props
    return JSON.parse(JSON.stringify(this.#props));
  }
}
