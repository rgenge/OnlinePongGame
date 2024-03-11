import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';

@Module({
  controllers: [LobbyController],
  providers: [LobbyGateway, LobbyService],
})
export class LobbyModule {}
