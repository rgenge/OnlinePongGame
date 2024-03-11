import { Injectable } from '@nestjs/common';
import Strategy = require('passport-42');
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { config } from 'dotenv';
import { UserService } from '../../user/service/user.service';

config();

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.NEST_API_CLIENT_ID,
      clientSecret: process.env.NEST_API_CLIENT_SECRET,
      callbackURL: process.env.NEST_API_CLIENT_URL,
    });
  }
  async validate(
    acessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    this.userService.insertUser(
      profile.username,
      profile.token,
      false,
      profile.id,
      profile.email,
      profile.username,
      '',
    );
    done(null, profile);
  }
}
