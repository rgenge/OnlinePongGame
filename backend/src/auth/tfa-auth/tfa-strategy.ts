import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class TfaStrategy extends PassportStrategy(Strategy, 'jwt-tfa') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.NEST_API_JWT_SECRET,
    });
  }
  async validate(payload: any): Promise<any> {
    if (payload == null) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return { ftLogin: payload.req };
  }
}
