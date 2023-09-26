import { BadRequestException, Injectable } from '@nestjs/common';
import { GameProgress, IGameAndTask } from './game-progress';
import { GameService } from '../../game/game.service';
import { Socket } from 'socket.io';
import { IUser } from '../../user/items/users.interface';
import { TaskService } from '../../task/task.service';
import { ITask } from '../../task/items/task.interface';
import { IGrade } from '../../grade/domains/grade.interface';
import { GradeService } from '../../grade/grade.service';
import { IGradePutMessage } from '../domains/grade-put-message.interface';
import { UserGradeInfoService } from '../../user-grade-info/user-grade-info.service';
import { IUserGradeInfo } from '../../user-grade-info/domains/user-grade-info.interface';
import { StatisticService } from '../../statistic/statistic.service';
import { IGame } from '../../game/domains/game.interface';

interface IGameIdAndUserType {
  gameId: string;
  userType: string;
}

@Injectable()
export class GameProgressRoutingService {
  games: GameProgress[] = [];
  mapSocketIdByGameId = new Map<string, IGameIdAndUserType>();
  constructor(
    private gameService: GameService,
    private taskService: TaskService,
    private gradeService: GradeService,
    private userGradeInfoService: UserGradeInfoService,
    private statisticService: StatisticService,
  ) {}

  public async connectAdmin(user: IUser, client: Socket, gameId: string) {
    const game = this.getGameProgressByGameId(gameId);
    if (game) {
      game.connectAdmin(client, user);
    } else {
      const gameDb = await this.gameService.getByGameId(gameId);
      const prepareGame = await this.prepareGame(gameDb);
      if (prepareGame) {
        const newGameProgress = new GameProgress(
          prepareGame.game,
          prepareGame.singleTasks,
          prepareGame.doubleTasks,
          prepareGame.grades,
          this.userGradeInfoService,
          this.statisticService,
        );
        this.games.push(newGameProgress);
        newGameProgress.connectAdmin(client, user);
      }
    }
    this.mapSocketIdByGameId.set(client.id, { gameId, userType: 'admin' });
  }
  public async connectUser(
    teamCode: number,
    client: Socket,
    gameId: string,
    userCode: string,
    userType: string,
  ) {
    const game = this.getGameProgressByGameId(gameId);
    if (game) {
      await game.connectUser(userCode, teamCode, client, userType);
    } else {
      let prepareGame: IGameAndTask;
      try {
        const gameDb = await this.gameService.getByGameId(gameId);
        prepareGame = await this.prepareGame(gameDb);
      } catch (e) {
        throw new BadRequestException('ошибка при загрузке игры');
      }
      if (prepareGame) {
        const newGameProgress = new GameProgress(
          prepareGame.game,
          prepareGame.singleTasks,
          prepareGame.doubleTasks,
          prepareGame.grades,
          this.userGradeInfoService,
          this.statisticService,
        );
        this.games.push(newGameProgress);
        await newGameProgress.connectUser(userCode, teamCode, client, userType);
      }
    }
    this.mapSocketIdByGameId.set(client.id, { gameId, userType: 'user' });
  }
  private async prepareGame(game: IGame): Promise<IGameAndTask> | null {
    if (game) {
      const grades: IGrade[] = [];
      for (const template of game.templateGame) {
        if (template.type !== 'grade') {
          continue;
        }
        const grade = await this.gradeService.getGradeById(template.target);
        if (!grade) return null;
        grades.push(grade);
      }
      const singleTasks: ITask[] = [];
      const doubleTasks: ITask[] = [];
      for (const taskId of game.tasksSingle) {
        const task = await this.taskService.geTaskById(taskId);
        if (task) {
          singleTasks.push(task);
        } else {
          return null;
        }
      }
      for (const taskId of game.tasksDouble) {
        const task = await this.taskService.geTaskById(taskId);
        if (task) {
          doubleTasks.push(task);
        } else {
          return null;
        }
      }
      return { game: game, doubleTasks, singleTasks, grades };
    } else {
      return null;
    }
  }

  public async commandGame(gameId: string, command: string) {
    const gameProgress = this.getGameProgressByGameId(gameId);
    if (gameProgress) {
      switch (command) {
        case 'start':
          gameProgress.startGame();
          break;
        case 'stop':
          gameProgress.stopGame();
          break;
        case 'next_round':
          gameProgress.nextRound();
          break;
        case 'user-timer-true':
          gameProgress.controlUserTimer(true);
          break;
        case 'user-timer-false':
          gameProgress.controlUserTimer(false);
          break;
        case 'refresh':
          const game = await this.gameService.getByGameId(gameId);
          const gameData = await this.prepareGame(game);
          gameProgress.refreshGame(
            gameData.game,
            gameData.singleTasks,
            gameData.doubleTasks,
            gameData.grades,
          );
          break;
      }
    }
  }

  private getGameProgressByGameId(gameId: string) {
    return this.games.find((g) => g.game.id === gameId);
  }
  private getGameProgressByCodeGame(codeGame: number) {
    return this.games.find((g) => g.game.code === codeGame);
  }

  setUserInfo(gameId: string, userGradeInfo: IUserGradeInfo) {
    const game = this.getGameProgressByGameId(gameId);
    if (game) {
      game.setUserInfo(userGradeInfo);
    }
  }

  public putUserGrade(userGrade: IGradePutMessage) {
    const game = this.getGameProgressByGameId(userGrade.game);
    if (game) {
      game.putGrade(userGrade);
    }
  }
  putChoiceTypeUser(gameId: string, userCode: string, type: string) {
    const game = this.getGameProgressByGameId(gameId);
    if (game) {
      game.putChoiceTypeUser(userCode, type);
    } else {
      throw new BadRequestException('игра не найдена');
    }
  }
  public disconnect(socketId: string) {
    const useData = this.mapSocketIdByGameId.get(socketId);
    if (!useData) return;
    const game = this.getGameProgressByGameId(useData.gameId);
    if (!game) return;
    if (useData.userType === 'admin') {
      game.disconnectAdmin(socketId);
    } else if (useData.userType === 'user') {
      game.disconnectUser(socketId);
    }
    this.mapSocketIdByGameId.delete(socketId);
  }

  async loginGamerByCode(codeGame: number) {
    const game = this.getGameProgressByCodeGame(codeGame);
    if (game) {
      return game.loginByUserCode();
    } else {
      const gameDb = await this.gameService.getByCodeGame(codeGame);
      const prepareGame = await this.prepareGame(gameDb);
      if (prepareGame) {
        const newGameProgress = new GameProgress(
          prepareGame.game,
          prepareGame.singleTasks,
          prepareGame.doubleTasks,
          prepareGame.grades,
          this.userGradeInfoService,
          this.statisticService,
        );
        this.games.push(newGameProgress);
        return newGameProgress.loginByUserCode();
      }
    }
    throw new BadRequestException('неверный код игры');
  }
}
