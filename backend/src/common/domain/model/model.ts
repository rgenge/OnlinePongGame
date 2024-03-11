import { v4 as uuidV4 } from 'uuid';

export abstract class Model<T = Record<string, any>> {
  readonly id: string;
  protected props: T = {} as T;

  protected constructor(id?: string) {
    this.id = id || uuidV4();
  }

  toJson(): ({ id: string } & T) | any {
    return {
      ...this.props,
      id: this.id,
    };
  }

  toPersistence(): ({ id: string } & T) | any {
    return {
      ...this.props,
      id: this.id,
    };
  }
}
