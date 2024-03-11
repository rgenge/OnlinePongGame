import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserRepositoryProvider } from './repository/user.repository.provider';
@Module({
  providers: [UserService, UserRepositoryProvider],
})
export class UserModule {}
