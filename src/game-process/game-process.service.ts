import { BadGatewayException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Socket } from 'socket.io';
import { GameProgressRoutingService } from './game-process/game-progress-routing.service';
import { IGradePutMessage } from './domains/grade-put-message.interface';
import { IUserGradeInfo } from '../user-grade-info/domains/user-grade-info.interface';

@Injectable()
export class GameProcessService {
  constructor(
    private userService: UserService,
    private gameProgressService: GameProgressRoutingService,
  ) {}
  public async loginAdmin(client: Socket, token: string, gameId: string) {
    const user = await this.userService.getUserByToken(token);
    if (user) {
      await this.gameProgressService.connectAdmin(user, client, gameId);
    } else {
      throw new BadGatewayException('неизвестный пользователь');
    }
  }

  public async loginUser(
    client: Socket,
    teamCode: number,
    gameId: string,
    codeUser: string,
    userType: string,
  ) {
    await this.gameProgressService.connectUser(
      teamCode,
      client,
      gameId,
      codeUser,
      userType,
    );
  }

  public async controlGame(gameId: string, command: string) {
    await this.gameProgressService.commandGame(gameId, command);
  }

  public putUserGrade(userGrade: IGradePutMessage) {
    this.gameProgressService.putUserGrade(userGrade);
  }
  putChoiceTypeUser(gameId: string, userCode: string, type: string) {
    this.gameProgressService.putChoiceTypeUser(gameId, userCode, type);
  }
  public disconnect(socketId: string) {
    this.gameProgressService.disconnect(socketId);
  }
  setUserInfo(gameId: string, userGradeInfo: IUserGradeInfo) {
    this.gameProgressService.setUserInfo(gameId, userGradeInfo);
  }

  async loginGamerByCode(codeGame: number) {
    return this.gameProgressService.loginGamerByCode(codeGame);
  }
}
