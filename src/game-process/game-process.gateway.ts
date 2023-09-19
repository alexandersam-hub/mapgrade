import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GameProcessService } from './game-process.service';
import { Socket } from 'socket.io';
import { IGradePutMessage } from './domains/grade-put-message.interface';
import { IUserGradeInfo } from '../user-grade-info/domains/user-grade-info.interface';

//{transports: ['websocket']}
@WebSocketGateway({ cors: true, origin: '*' })
export class GameProcessGateway implements OnGatewayDisconnect {
  constructor(private gameProcessService: GameProcessService) {}
  @SubscribeMessage('login')
  async login(
    client: Socket,
    message: {
      game: string;
      token: string;
      code: string;
      team: number;
      type: string;
    },
  ) {
    if (message.token) {
      try {
        await this.gameProcessService.loginAdmin(
          client,
          message.token,
          message.game,
        );
      } catch (e) {
        this.sendErrorMessage(client, e.message);
      }
    } else if (Number.isInteger(message.team)) {
      try {
        if (message.type !== 'single' && message.type !== 'double') {
          this.sendErrorMessage(client, 'неверный формат типа испытаний');
        }
        await this.gameProcessService.loginUser(
          client,
          message.team,
          message.game,
          message.code,
          message.type,
        );
      } catch (e) {
        console.log(e);
        this.sendErrorMessage(client, e.message);
      }
    }
  }
  @SubscribeMessage('control')
  controlGame(
    client: Socket,
    message: { game: string; master: string; command: string },
  ) {
    if (message.command)
      this.gameProcessService.controlGame(message.game, message.command);
    else {
      this.sendErrorMessage(client, 'нет команды');
    }
  }

  @SubscribeMessage('grade')
  gradeChooseGame(client: Socket, message: IGradePutMessage) {
    try {
      this.gameProcessService.putUserGrade(message);
    } catch (e) {
      this.sendErrorMessage(client, e.message);
    }
  }

  @SubscribeMessage('ping')
  getPing(client: Socket) {
    client.emit('ping', { message: 'pong' });
  }
  @SubscribeMessage('user-grade-info')
  setUserGradeInfo(
    client: Socket,
    message: { info: IUserGradeInfo; game: string },
  ): void {
    if (message && message.info && message.game)
      this.gameProcessService.setUserInfo(message.game, message.info);
    else this.sendErrorMessage(client, 'заполнены не все поля');
  }
  handleDisconnect(client: Socket): void {
    this.gameProcessService.disconnect(client.id);
  }

  sendErrorMessage(client: Socket, message: string) {
    client.emit('error', { message });
  }
}
