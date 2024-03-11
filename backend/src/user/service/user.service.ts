import {
  Req,
  Res,
  Post,
  BadRequestException,
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../domain/model/user/user';
import { generateSecret, verify } from '2fa-util';

const teste = new User({
  nickname: 'oi',
  token: null,
  validCode: false,
  userId: '',
  email: '',
  username: '',
  tfaSecret: '',
});

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async insertUser(
    nickname: string,
    token: string,
    validCode: boolean,
    userId: string,
    email: string,
    username: string,
    tfaSecret: string,
  ): Promise<string> {
    await this.checkDuplicatedUser(nickname);
    const user = new User({
      nickname,
      token,
      validCode,
      userId,
      email,
      username,
      tfaSecret,
    });
    const id = await this.userRepository.insert(user);

    return id;
  }
  private async checkDuplicatedUser(nickname: string) {
    const user = await this.userRepository.findOne({ nickname });

    if (user) {
      throw new BadRequestException(`nickname: ${nickname} already exists`);
    }
  }

  async getUser(nickname: string): Promise<any> {
    const user = await this.userRepository.findOne({ nickname });

    return user;
  }
}
