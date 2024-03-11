import { Controller, Get } from '@nestjs/common';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Get()
  getPong(): string[] {
    return this.lobbyService.getPong();
  }
}
