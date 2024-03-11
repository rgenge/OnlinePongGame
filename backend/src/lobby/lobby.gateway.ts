import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

class P1 {
  id = 0;
  x = 4;
  y = 0;
  width = 8;
  height = 100;
  colour = '#02CEFC';
  side = 'left';
  points = 0;
  room = '';
}

class P2 {
  id = 0;
  x = 1264;
  y = 0;
  width = 8;
  height = 100;
  colour = '#ED006C';
  side = 'right';
  points = 0;
  room = '';
}
class BALL {
  id = 0;
  x = 640;
  y = 350;
  dx = 7;
  dy = 7;
  rad = 9;
  speed = 2;
  intervalid;
}
class BALL2 {
  id = 0;
  x = 640;
  y = 350;
  dx = 7;
  dy = 7;
  rad = 9;
  speed = 4;
  intervalid;
}

const listOfPlayers: Map<number, any> = new Map();
let i = 0;
let lastRoom = 'empty';
let fastSpeed;
const ballOfRoom: Map<string, any> = new Map();
let queue = Array<string>();

@WebSocketGateway({ cors: true })
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected + ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected ` + client.id);

    let id: number;
    for (id of listOfPlayers.keys()) {
      if (listOfPlayers.get(id).id === client.id) {
        break;
      } else {
        continue;
      }
    }
    this.server.emit('PlayerDisconnected', client.id);
    if (listOfPlayers.get(i) && listOfPlayers.get(i)?.room) {
      client.leave(listOfPlayers.get(i)?.room);
      clearInterval(ballOfRoom.get(listOfPlayers.get(i).room).intervalid);
    }
    listOfPlayers.delete(id);
    i--;
  }

  @SubscribeMessage('handle_reconnect')
  handleReconnect(client: Socket) {
    console.log('Client trying to reconnect');

    let id: number;
    for (id of listOfPlayers.keys()) {
      if (listOfPlayers.get(id).id === client.id) {
        this.server.emit('PlayerReconnected', client.id);
        break;
      } else {
        continue;
      }
    }
  }

  @SubscribeMessage('join_game')
  handleJoinGame(client: Socket) {
    let player = null;

    for (let [key, value] of listOfPlayers.entries()) {
      if (value.id === client.id) {
        player = value;
        console.log('player already exists');
        break;
      }
    }
    if (!player) {
      i++;
      if (i % 2 !== 0) {
        listOfPlayers.set(i, new P1());
      } else {
        listOfPlayers.set(i, new P2());
      }
      listOfPlayers.get(i).id = client.id;
      queue[i] = listOfPlayers.get(i).id;
    }
    if (i % 2 !== 0) {
      const roomId = (queue[i] + '+' + 'gameRoom').toString();
      lastRoom = roomId;
      listOfPlayers.get(i).room = roomId;
      client.join(roomId);
    } else if (i % 2 === 0) {
      const roomId = lastRoom;
      listOfPlayers.get(i).room = roomId;
      client.join(roomId);
      this.server.to(roomId).emit('player_moved', listOfPlayers.get(i - 1));
      this.server.to(roomId).emit('player_moved', listOfPlayers.get(i));
      this.server.to(roomId).emit('START_GAME');
      if (fastSpeed === true) ballOfRoom.set(roomId, new BALL2());
      else ballOfRoom.set(roomId, new BALL());
      ballOfRoom.get(roomId).id = roomId;
      fastSpeed = false;
      // Handle ball movement
      this.handleBallMovement(
        listOfPlayers.get(i - 1),
        listOfPlayers.get(i),
        ballOfRoom.get(roomId),
        client,
      );
    }
  }
  @SubscribeMessage('cancelQueue')
  handleCancelQueue(client: Socket) {
    let id: number;
    for (id of listOfPlayers.keys()) {
      if (listOfPlayers.get(id).id === client.id) {
        break;
      } else {
        continue;
      }
    }
    let ball: string;
    for (ball of ballOfRoom.keys()) {
      if (
        listOfPlayers.get(id).roomId &&
        ballOfRoom.get(listOfPlayers.get(id).roomId)
      ) {
        ballOfRoom.delete(listOfPlayers.get(id).roomId);
      }
    }
    listOfPlayers.delete(id);
    i--;
  }
  @SubscribeMessage('increase_speed')
  handleSpeed(client: Socket) {
    fastSpeed = true;
    let id: number;

    for (id of listOfPlayers.keys()) {
      if (listOfPlayers.get(id).id === client.id) {
        break;
      } else {
        continue;
      }
    }
    if (
      listOfPlayers.get(id).room &&
      ballOfRoom.get(listOfPlayers.get(id).room)
    ) {
      ballOfRoom.get(listOfPlayers.get(id).room).speed = 10;
    }
  }
  @SubscribeMessage('arrow_keyUp')
  handleKeyUp(client: Socket) {
    let id: number;

    for (id of listOfPlayers.keys()) {
      if (listOfPlayers.get(id).id === client.id) {
        break;
      } else {
        continue;
      }
    }
    if (listOfPlayers.get(id)?.y && listOfPlayers.get(id).y > 0) {
      listOfPlayers.get(id).y -= 40;
      this.server
        .to(listOfPlayers.get(id).room)
        .emit('player_moved', listOfPlayers.get(id));
    }
  }

  @SubscribeMessage('arrow_keyDown')
  handleKeyDown(client: Socket) {
    let id: number;
    for (id of listOfPlayers.keys()) {
      if (listOfPlayers.get(id).id === client.id) {
        break;
      } else {
        continue;
      }
    }
    if (listOfPlayers.get(id)?.y < 620) {
      listOfPlayers.get(id).y += 40;
      this.server
        .to(listOfPlayers.get(id).room)
        .emit('player_moved', listOfPlayers.get(id));
    }
  }
  handleBallMovement(
    player1: any,
    player2: any,
    ball_ins: any,
    client: Socket,
  ) {
    if (!player1 || !player2) {
      console.log('both players not connected');
      return false;
    }
    function collision(objPlayer: any, objBall: any) {
      if (
        objPlayer.x + objPlayer.width > objBall.x &&
        objPlayer.x < objBall.x + objBall.rad &&
        objPlayer.y + objPlayer.height > objBall.y &&
        objPlayer.y < objBall.y + objBall.rad
      ) {
        return true;
      } else {
        return false;
      }
    }
    ball_ins.intervalid = setInterval(
      () => {
        if (player1.room === ball_ins.id) {
          if (ball_ins.y < 0 || ball_ins.y + ball_ins.rad > 720) {
            ball_ins.dy = -ball_ins.dy;
          }
          if (ball_ins.x < 0) {
            if (player2.side === 'right') {
              player2.points = player2.points + 1;
              this.server
                .to(player2.room)
                .emit('player2_scored', player2.points);
              if (player2.points === 10) {
                this.server.to(player2.room).emit('player2_won');
                clearInterval(ball_ins.intervalid);
                client.leave(player2.room);

                player2.points = 0;
                let id: number;
                let room = player1.room;
                for (id of listOfPlayers.keys()) {
                  if (
                    listOfPlayers.get(id).id === player1.id ||
                    listOfPlayers.get(id).id === player2.id
                  ) {
                    listOfPlayers.delete(id);
                  } else {
                    continue;
                  }
                }
                let ball: string;
                for (ball of ballOfRoom.keys()) {
                  if (ballOfRoom.get(room)) {
                    ballOfRoom.delete(room);
                  }
                }
              }
            }
            ball_ins.x = 640;
            ball_ins.y = 350;
            ball_ins.dx = -7;
            ball_ins.dy = -7;
          } else if (ball_ins.x + ball_ins.rad > 1280) {
            if (player1.side === 'left') {
              player1.points = player1.points + 1;
              this.server
                .to(player1.room)
                .emit('player1_scored', player1.points);
              if (player1.points === 10) {
                this.server.to(player1.room).emit('player1_won');
                clearInterval(ball_ins.intervalid);
                client.leave(player1.room);
                player1.points = 0;
                let id: number;
                let room = player1.room;
                for (id of listOfPlayers.keys()) {
                  if (
                    listOfPlayers.get(id).id === player1.id ||
                    listOfPlayers.get(id).id === player2.id
                  ) {
                    listOfPlayers.delete(id);
                  } else {
                    continue;
                  }
                }
                let ball: string;
                for (ball of ballOfRoom.keys()) {
                  if (ballOfRoom.get(room)) {
                    ballOfRoom.delete(room);
                  }
                }
              }
            }
            ball_ins.x = 640;
            ball_ins.y = 350;
            ball_ins.dx = 7;
            ball_ins.dy = 7;
          }
          if (
            collision(player1, ball_ins) &&
            ball_ins.dx < 0 &&
            player1.side == 'left'
          ) {
            ball_ins.dx = -ball_ins.dx;
          }

          if (
            collision(player2, ball_ins) &&
            ball_ins.dx > 0 &&
            player2.side == 'right'
          ) {
            ball_ins.dx = -ball_ins.dx;
          }
          ball_ins.x += ball_ins.dx;
          ball_ins.y += ball_ins.dy;
          this.server.sockets.to(player1.room).emit('ball_update', ball_ins);
        }
      },
      1000 / (30 * ball_ins.speed),
    );
  }
}
