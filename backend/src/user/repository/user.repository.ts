import { User, UserProps } from '../domain/model/user/user';

export abstract class UserRepository {
  abstract findOne(options: Partial<UserProps>): Promise<User>;
  abstract insert(user: User): Promise<string>;
}
