import { Model } from '@/common/domain/model/model';

export type UserProps = {
  nickname: string,
  token: string,
  validCode:boolean,
  userId: string,
  email: string,
  username: string,
  tfaSecret: string
};

export class User extends Model<UserProps> {
  protected props = {} as UserProps;

  constructor({ nickname, token, validCode, userId, email,username, tfaSecret}: UserProps, id?: string) {
    super(id);
    this.props.nickname = nickname,
    this.props.token= token,
    this.props.validCode = validCode,
    this.props.userId = userId;
    this.props.email = email;
    this.props.username = username;
    this.props.tfaSecret = tfaSecret;
  }

  getNickname(): string {
    return this.props.nickname;
  }
  getToken(): string {
    return this.props.token;
  }
  getValidation(): boolean {
    return this.props.validCode;
  }
  getUserId(): string {
    return this.props.userId;
  }
  getEmail(): string {
    return this.props.email;
  }
  getUsername(): string {
    return this.props.username;
  }
  setToken(token){
    this.props.token = token;
  }
  setTfaSecret(tfaSecret){
    this.props.tfaSecret = tfaSecret;
  }
}
