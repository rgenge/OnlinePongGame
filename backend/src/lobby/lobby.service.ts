import { Injectable } from '@nestjs/common';

@Injectable()
export class LobbyService {
  getPong(): string[] {
    return ['player1', 'player2'];
  }
}
