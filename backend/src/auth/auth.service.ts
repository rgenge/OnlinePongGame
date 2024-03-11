import {
  HttpStatus,
  HttpException,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from '../user/service/user.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '../user/repository/user.repository';
import { User } from '../user/domain/model/user/user';
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
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}
  //   async login(username: string): Promise<any>{
  //       const user = await this.userService.getUser(username);
  //   }
  async Auth42Redirect(@Req() req: any, @Res() res: Response): Promise<void> {
    const user = await this.userService.getUser(req.user.username);
    console.log(req.user.id);
    const accessToken: string = this.generateJwtToken(req.user.id);
    res.cookie('token', accessToken);
    user.props.token = accessToken;
    if (req.user.mfa) {
      res.redirect(process.env.FRONTEND_MFA);
      return;
    }
    return;
  }
  private generateJwtToken(UserId: any): string {
    console.log(UserId, `${process.env.NEST_API_JWT_SECRET}`);
    return this.jwtService.sign(
      { req: UserId },
      { secret: `${process.env.NEST_API_JWT_SECRET}` },
    );
  }

  async generateTfaSecret(UserId: string) {
    const user = await this.userService.getUser('acosta-a');
    const mfaSecret = await generateSecret(user.props.userId, 'Pong');
    user.setTfaSecret(mfaSecret.secret);
    await this.userRepository.insert(user);
    return {
      secret: mfaSecret.secret,
      qr_code_url: mfaSecret.qrcode, //não estou utilizando
    };
  }

  async verifyTfaSecret(id: string, code: string): Promise<void> {
    const user = await this.userService.getUser('acosta-a');
    console.log('tfa secret: ', user.props.tfaSecret);
    if (!(await verify(code, user.props.tfaSecret))) {
      throw new HttpException('Token is Invalid', HttpStatus.BAD_REQUEST);
    } else console.log('Valid Token');
    const isCodeValid = user.getValidation();
    await this.userRepository.insert(user);
  }
}
