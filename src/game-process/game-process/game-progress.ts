import { IGame } from '../../game/domains/game.interface';
import { ISocketAdmin, ISocketUser } from './socket-user.interface';
import { ITask } from '../../task/items/task.interface';
import { IGrade } from '../../grade/domains/grade.interface';
import { AdditionalTask } from '../domains/additional-task';
import { Socket } from 'socket.io';
import { SocketAdmin, SocketUser } from './socket-user';
import { IUser } from '../../user/items/users.interface';
import { IGradePutMessage } from '../domains/grade-put-message.interface';
import { BadGatewayException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { UserGradeInfoService } from '../../user-grade-info/user-grade-info.service';
import { IUserGradeInfo } from '../../user-grade-info/domains/user-grade-info.interface';
import { IStatisticResult } from '../../statistic/domains/statistic.interface';
import { StatisticService } from '../../statistic/statistic.service';

export interface IUserTask extends ITask {
  img?: string;
  localTitle?: string;
  link?: string;
}
export interface IRoundGrade {
  position: number;
  grade: IGrade;
}

export interface IGameInfoForAdmin {
  game: IGame;
  isStart: boolean;
  isFinish: boolean;
  isPause: boolean;
  isViewUserTimer: boolean;
  countConnectUser: number;
  currentRound: number;
  singleTasks: ITask[];
  doubleTasks: ITask[];
  roundGame: RoundGame;
  map: string;
  isViewTitle: boolean;
}

export interface IGameInfoForUser {
  titleGame: string;
  grade: IRoundGrade | null;
  task: ITask | null;
  isStart: boolean;
  isFinish: boolean;
  isPause: boolean;
  image: string;
  isDouble: boolean;
  basicColor: string;
  logoImg: string;
  map: string;
  isViewTitle: boolean;
}

export interface IGameAndTask {
  game: IGame;
  singleTasks: ITask[];
  doubleTasks: ITask[];
  grades: IGrade[];
}

export class RoundGame {
  roundNumber: number;
  grades: IRoundGrade[] = [];
  singleTasks: IUserTask[];
  doubleTasks: IUserTask[];
}

export class GameProgress {
  game: IGame;
  isStart: boolean;
  isFinish: boolean;
  isPause: boolean;
  singleTasks: ITask[];
  doubleTasks: ITask[];
  administrators: ISocketAdmin[] = [];
  users: ISocketUser[] = [];
  currentRound: number;
  positionTemplate: number;
  roundGame: RoundGame = new RoundGame();
  grades: IGrade[];
  timer: any;
  time: number;
  statisticsResult: IStatisticResult[];
  counterPositionGrade: number;
  counterTeamCode: number = 0;
  constructor(
    game: IGame,
    singleTasks: ITask[],
    doubleTasks: ITask[],
    grades: IGrade[],
    private userGradeService: UserGradeInfoService,
    private statisticService: StatisticService,
  ) {
    this.game = game;
    this.isFinish = false;
    this.isStart = false;
    this.isPause = false;
    this.currentRound = 0;
    this.counterPositionGrade = 0;
    this.singleTasks = singleTasks;
    this.doubleTasks = doubleTasks;
    this.statisticsResult = [];
    this.positionTemplate = 0;
    this.grades = grades;
    this.time = 0;
    this.roundGame.roundNumber = 0;
    this.roundGame.singleTasks = new Array(this.game.countTeam);
    this.roundGame.grades = [];
    if (this.game.isDouble) {
      this.roundGame.doubleTasks = new Array(this.game.countTeam);
    }
    this.preparationRound();
  }

  private preparationRound() {
    const currentTemplate = this.game.templateGame[this.positionTemplate];
    if (!currentTemplate) {
      console.log('not template');
      return;
    }
    switch (currentTemplate.type) {
      case 'grade':
        const grade = this.grades.find((g) => g.id === currentTemplate.target);
        if (grade) {
          this.roundGame.grades.push({
            grade,
            position: this.counterPositionGrade,
          });
          this.counterPositionGrade++;
        }

        this.positionTemplate++;
        this.preparationRound();
        return;
      case 'task':
        for (let i = 0; i < this.game.countTeam; i++) {
          this.roundGame.singleTasks[i] =
            this.singleTasks[this.game.maps.singleMap[i][this.currentRound]];
          const descriptionCurrentTask = this.game.descriptionsTasks.task.find(
            (t) => t.taskId === this.roundGame.singleTasks[i].id,
          );
          if (descriptionCurrentTask) {
            this.roundGame.singleTasks[i].img = descriptionCurrentTask.img;
            this.roundGame.singleTasks[i].link = descriptionCurrentTask.link;
            this.roundGame.singleTasks[i].localTitle =
              descriptionCurrentTask.title;
          }
          if (
            this.game.isDouble &&
            this.currentRound % 2 === 0 &&
            this.game.maps.doubleMap &&
            this.game.maps.doubleMap[i]
          ) {
            this.roundGame.doubleTasks[i] =
              this.doubleTasks[
                this.game.maps.doubleMap[i][this.currentRound / 2]
              ];

            const descriptionCurrentTask =
              this.game.descriptionsTasks.task.find(
                (t) => t.taskId === this.roundGame.doubleTasks[i].id,
              );
            if (descriptionCurrentTask) {
              this.roundGame.doubleTasks[i].img = descriptionCurrentTask.img;
              this.roundGame.doubleTasks[i].link = descriptionCurrentTask.link;
              this.roundGame.doubleTasks[i].localTitle =
                descriptionCurrentTask.title;
            }
          }
        }
        break;

      case 'start':
        const startTask: IUserTask = new AdditionalTask(
          'start',
          this.game.descriptionsTasks.start.text,
        );
        startTask.img = this.game.descriptionsTasks.start.img;
        for (let i = 0; i < this.game.countTeam; i++) {
          this.roundGame.singleTasks[i] = startTask;
          if (this.game.isDouble) {
            this.roundGame.doubleTasks[i] = startTask;
          }
        }
        break;

      case 'finish':
        const finishTask: IUserTask = new AdditionalTask(
          'finish',
          this.game.descriptionsTasks.finish.text,
        );
        finishTask.img = this.game.descriptionsTasks.finish.img
        this.isFinish = true;
        for (let i = 0; i < this.game.countTeam; i++) {
          this.roundGame.singleTasks[i] = finishTask;
          if (this.game.isDouble) {
            this.roundGame.doubleTasks[i] = finishTask;
          }
        }
        this.positionTemplate++;
        while (this.positionTemplate < this.game.templateGame.length) {
          const nextTemplate = this.game.templateGame[this.positionTemplate];
          if (nextTemplate.type === 'grade') {
            const grade = this.grades.find(
              (g) => g.id === currentTemplate.target,
            );
            if (grade) {
              this.roundGame.grades.push({
                grade,
                position: this.counterPositionGrade,
              });
              this.counterPositionGrade++;
            }
          }
          this.positionTemplate++;
        }
        clearInterval(this.timer);
        this.timer = undefined;
        break;
    }
    this.sendMessageAdmin('game', this.getGameInfo());
    this.sendInfoGameUsers();
  }

  public async nextRound() {
    this.time = 0;
    this.currentRound++;
    this.positionTemplate++;
    this.roundGame.grades = [];
    if (this.statisticsResult.length > 0) {
      await this.saveStatistics();
    }
    this.preparationRound();
  }

  public connectAdmin(client: Socket, user: IUser) {
    const newAdminSocket = new SocketAdmin(client, user);
    this.administrators.push(newAdminSocket);
    client.emit('game', this.getGameInfo());
    client.emit('grade', this.statisticsResult);
  }
  private getGameInfoForUser(
    teamCode: number,
    type: string,
    userCode: string,
  ): IGameInfoForUser {
    if (this.roundGame.grades.length > 0) {
      const grade = this.getNextGradeByUserCode(userCode);
      if (grade) {
        return {
          titleGame: this.game.title,
          isFinish: this.isFinish,
          isStart: this.isStart,
          task: null,
          grade: grade,
          image: this.game.image,
          isPause: this.isPause,
          isDouble: this.game.isDouble,
          basicColor: this.game.color,
          logoImg: this.game.logoImg,
          map: this.game.mapImg,
          isViewTitle: this.game.isViewTitleUser,
        };
      }
    }

    let taskTeam: ITask;
    if (type === 'single') {
      taskTeam = this.roundGame.singleTasks[teamCode];
    } else if (type === 'double') {
      taskTeam = this.roundGame.doubleTasks[teamCode];
    }
    return {
      titleGame: this.game.title,
      isFinish: this.isFinish,
      isStart: this.isStart,
      task: taskTeam,
      grade: null,
      image: this.game.image,
      isPause: this.isPause,
      isDouble: this.game.isDouble,
      basicColor: this.game.color,
      logoImg: this.game.logoImg,
      map: this.game.mapImg,
      isViewTitle: this.game.isViewTitleUser,
    };
  }
  public async connectUser(
    userCode: string,
    teamCode: number,
    client: Socket,
    userType: string,
  ) {
    if (!this.game.isDouble && userType === 'double') {
      throw new BadGatewayException(
        'тип заданий "парное" не доступно в выбранной игре',
      );
    }
    if (!uuidValidate(userCode)) userCode = uuidv4();
    const userSocket = this.getUserSocketByUserCode(userCode);
    if (this.game.isRequestUserGradeInfo) {
      const userInfo = await this.userGradeService.get(userCode);
      if (!userInfo) {
        this.sendRequestUserInfo(client, userCode);
      }
    }
    if (userSocket) {
      userSocket.socket = client;
      userSocket.teamCode = teamCode;
      this.sendMessageClient('login', userSocket, {
        code: userSocket.userCode,
      });
      const gameInfo = this.getGameInfoForUser(teamCode, userType, userCode);
      this.sendMessageClient('game', userSocket, gameInfo);
    } else {
      const newUserSocket = new SocketUser(
        client,
        userCode,
        teamCode,
        userType,
      );
      this.users.push(newUserSocket);
      this.sendMessageClient('login', newUserSocket, { code: userCode });
      const gameInfo = this.getGameInfoForUser(teamCode, userType, userCode);
      this.sendMessageClient('game', newUserSocket, gameInfo);
    }
  }

  private getUserSocketByUserCode(userCode: string): ISocketUser | null {
    if (!userCode) return null;
    return this.users.find((u) => u.userCode === userCode) ?? null;
  }

  public getGameInfo(): IGameInfoForAdmin {
    return {
      game: this.game,
      isStart: this.isStart,
      isFinish: this.isFinish,
      countConnectUser: this.users.length,
      currentRound: this.currentRound,
      doubleTasks: this.doubleTasks,
      singleTasks: this.singleTasks,
      roundGame: this.roundGame,
      isPause: this.isPause,
      isViewUserTimer: this.game.isUserTimerView,
      map: this.game.mapImg,
      isViewTitle: this.game.isViewTitleUser,
    };
  }
  putChoiceTypeUser(userCode: string, type: string) {
    const userSocket = this.getUserSocketByUserCode(userCode);
    if (userSocket.socket) {
      userSocket.userType = type;
      const gameInfo = this.getGameInfoForUser(
        userSocket.teamCode,
        userSocket.userType,
        userSocket.userCode,
      );
      userSocket.socket.emit('choice-type-user', { type });
      userSocket.socket.emit('game', gameInfo);
    } else {
      throw new BadGatewayException('не удалось изменить тип');
    }
  }
  public startGame() {
    this.isStart = true;
    this.startTimer();
    if (this.isPause) {
      this.isPause = false;
    } else {
      this.positionTemplate++;
      this.roundGame.grades = [];
      this.preparationRound();
    }
    this.sendMessageAdmin('game', this.getGameInfo());
    this.sendInfoGameUsers();
  }

  public stopGame() {
    this.isPause = true;
    this.isStart = false;
    this.stopTimer();
    this.sendMessageAdmin('game', this.getGameInfo());
    this.sendInfoGameUsers();
  }

  public refreshGame(
    game: IGame,
    singleTasks: ITask[],
    doubleTasks: ITask[],
    grades: IGrade[],
  ) {
    this.game = game;
    this.singleTasks = singleTasks;
    this.doubleTasks = doubleTasks;
    this.grades = grades;
    this.isStart = false;
    this.isPause = false;
    this.isFinish = false;
    this.currentRound = 0;
    this.positionTemplate = 0;
    this.counterPositionGrade = 0;
    this.roundGame.roundNumber = 0;
    this.roundGame.singleTasks = new Array(this.game.countTeam);
    this.roundGame.grades = [];
    if (this.game.isDouble) {
      this.roundGame.doubleTasks = new Array(this.game.countTeam);
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.time = 0;
    this.statisticsResult = [];
    this.users = this.users.filter((us) => us.socket);
    this.administrators = this.administrators.filter((a) => a.socket);
    this.sendGradesAdmins();
    this.preparationRound();
  }
  private startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
      this.startTimer();
    } else {
      this.timer = setInterval(() => {
        this.tickTimer();
      }, 1000);
    }
  }

  private stopTimer() {
    clearInterval(this.timer);
  }

  private tickTimer() {
    this.time++;
    if (this.time > this.game.timeRound * 60) {
      this.nextRound();
    }
    this.sendMessageAdmin('time', {
      time: this.game.timeRound * 60 - this.time,
    });
    if (this.game.isUserTimerView) {
      this.sendTimeUsers();
    }
  }
  private sendTimeUsers() {
    if (this.game.isDouble) {
      for (const userSocket of this.users) {
        if (userSocket.socket) {
          if (this.currentRound % 2 !== 0) {
            this.sendMessageClient('time', userSocket, {
              time: this.game.timeRound * 60 - this.time,
            });
          } else {
            if (userSocket.userType === 'single') {
              this.sendMessageClient('time', userSocket, {
                time: this.game.timeRound * 60 - this.time,
              });
            } else {
              this.sendMessageClient('time', userSocket, {
                time: this.game.timeRound * 60 * 2 - this.time,
              });
            }
          }
        }
      }
    } else {
      this.sendMessageUsers('time', {
        time: this.game.timeRound * 60 - this.time,
      });
    }
  }
  private sendMessageAll(action: string, message: unknown) {
    this.sendMessageAdmin(action, message);
    this.sendMessageUsers(action, message);
  }

  public sendMessageAdmin(action: string, message: unknown) {
    for (const adminSocket of this.administrators) {
      if (adminSocket.socket) adminSocket.socket.emit(action, message);
    }
  }

  private sendMessageClient(
    action: string,
    socketUser: ISocketUser,
    message: unknown,
  ) {
    if (socketUser && socketUser.socket) {
      socketUser.socket.emit(action, message);
    }
  }

  private sendMessageUsers(action: string, message: unknown) {
    for (const userSocket of this.users) {
      if (userSocket.socket) userSocket.socket.emit(action, message);
    }
  }

  private sendInfoGameUsers() {
    for (const userSocket of this.users) {
      if (userSocket.socket) {
        const gameInfo = this.getGameInfoForUser(
          userSocket.teamCode,
          userSocket.userType,
          userSocket.userCode,
        );
        userSocket.socket.emit('game', gameInfo);
      }
    }
  }

  sendGradesAdmins() {
    for (const adminSocket of this.administrators) {
      if (adminSocket.socket) {
        adminSocket.socket.emit('grade', this.statisticsResult);
      }
    }
  }

  private getNextGradeByUserCode(userCode: string): IRoundGrade | null {
    const roundGrades = this.roundGame.grades;
    for (const roundGrade of roundGrades) {
      const gradeResult = this.statisticsResult.find(
        (sr) =>
          sr.position === roundGrade.position &&
          sr.statistics.find((s) => s.userCode === userCode),
      );
      if (!gradeResult) {
        return roundGrade;
      }
    }
    return null;
  }

  public putGrade(userGrade: IGradePutMessage) {
    const staticsByPosition = this.statisticsResult.find(
      (sr) => sr.position === userGrade.position,
    );
    if (staticsByPosition) {
      const userGradeStatics = staticsByPosition.statistics.find(
        (st) => st.userCode === userGrade.user,
      );
      if (userGradeStatics) {
        throw new BadGatewayException('Уже существует ответ на данный опрос');
      } else {
        staticsByPosition.statistics.push({
          answer: userGrade.answer,
          userCode: userGrade.user,
        });
      }
    } else {
      const grade = this.grades.find((g) => g.id === userGrade.grade);
      if (!grade) {
        throw new BadGatewayException('Нет указанного опросника');
      }
      this.statisticsResult.push({
        grade,
        position: userGrade.position,
        statistics: [{ userCode: userGrade.user, answer: userGrade.answer }],
      });
    }
    const userSocket = this.getUserSocketByUserCode(userGrade.user);
    //
    if (userSocket && userSocket.socket) {
      const gameInfo = this.getGameInfoForUser(
        userSocket.teamCode,
        userSocket.userType,
        userSocket.userCode,
      );
      userSocket.socket.emit('game', gameInfo);
    }
    //
    this.sendGradesAdmins();
  }
  disconnectAdmin(socketId: string) {
    this.administrators = this.administrators.filter(
      (a) => a.socket && a.socket.id !== socketId,
    );
  }
  disconnectUser(socketId: string) {
    if (Array.isArray(this.users)) {
      const user = this.users.find((u) => u.socket && u.socket.id === socketId);
      if (user) {
        user.socket = null;
      }
    }
  }

  setUserInfo(userGradeInfo: IUserGradeInfo) {
    this.userGradeService.create(userGradeInfo);
  }

  sendRequestUserInfo(client: Socket, userCode: string) {
    client.emit('user-info', { code: userCode });
  }

  private async saveStatistics() {
    await this.statisticService.saveStatisticByGameId(
      this.game.id,
      this.statisticsResult,
    );
  }

  loginByUserCode() {
    if (this.game.isAutoTeam) {
      const team: number = this.newTeamCode();
      return {
        isTeamCode: true,
        team,
        title: this.game.title,
        countTeam: this.game.countTeam,
        gameId: this.game.id,
        isDouble: this.game.isDouble,
      };
    } else {
      return {
        isTeamCode: false,
        title: this.game.title,
        countTeam: this.game.countTeam,
        gameId: this.game.id,
        isDouble: this.game.isDouble,
      };
    }
  }

  private newTeamCode() {
    const code = this.counterTeamCode;
    this.counterTeamCode++;
    if (this.counterTeamCode >= this.game.countTeam) {
      this.counterTeamCode = 0;
    }
    return code;
  }

  controlUserTimer(isView: boolean) {
    this.game.isUserTimerView = isView;
    this.sendMessageAdmin('game', this.getGameInfo());
    if (!isView) {
      this.sendMessageUsers('time', { time: -1 });
    }
  }
}
