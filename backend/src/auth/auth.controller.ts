import {
  Post,
  Body,
  Patch,
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './42-auth/42.guards';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { Response } from 'express';
//import { UserService } from '../user/service/user.service'
import { User } from '../user/domain/model/user/user';
import { UserService } from '../user/service/user.service';
//teste deletar

const teste = new User({
  nickname: 'oi',
  token: null,
  validCode: true,
  userId: '',
  email: '',
  username: '',
  tfaSecret: '',
});

@Controller('auth')
export class AuthController {
  private savedTfaSecret: { secret: string }; // Variable to store TFA secret
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  //   @Public()
  //   @UseGuards(FortyTwoAuthGuard)
  //   @Get('login')
  //   async fortyTwoAuth(@Req() req: any ,@Res() res: any) {
  //   }

  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoRedirect(@Req() req: any, @Res() res: Response): Promise<void> {
    await this.authService.Auth42Redirect(req, res);
    //    if(!req.user) return res.redirect(`${process.env.HOST_FRONT}/`);
    //     const {username, name, _json} = req.user;
    return res.redirect(`${'www.intra.42.fr'}/`); //teste alterar
  }

  @Get('logout')
  async logout(@Req() req: any, @Res() res: Response): Promise<void> {
    res.clearCookie('token');
    console.log('logout');
    res.status(200).send({ message: 'Logout sucessful' });
    //      return res.redirect(process.env.HOST_FRONT);
  }
  @Post('generate-2fa')
  async generateTfaSecret(@Req() req) {
    console.log('2fa Secret Generated');
    this.savedTfaSecret = { secret: '' };
    const user = await this.userService.getUser('acosta-a'); //verificar com user
    const tfa = await this.authService.generateTfaSecret(user.props.userId);
    console.log(tfa.secret);
    this.savedTfaSecret.secret = tfa.secret;
    return this.savedTfaSecret;
  }

  @Post('verify-2fa')
  async verifyTfaSecret(@Req() req, @Body() body): Promise<void> {
    console.log('testando verify:', req.user);
    return this.authService.verifyTfaSecret(
      await this.userService.getUser('acosta-a'),
      body.code,
    ); //verificar com user
  }
}
