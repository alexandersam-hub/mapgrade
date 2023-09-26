import { BadRequestException, Injectable } from '@nestjs/common';
import * as exceljs from 'exceljs';
import * as tmp from 'tmp';
import { StatisticService } from '../statistic/statistic.service';
import { GameService } from '../game/game.service';
import { UserGradeInfoService } from '../user-grade-info/user-grade-info.service';
@Injectable()
export class ExcelGenerateService {
  constructor(
    private statisticService: StatisticService,
    private gameService: GameService,
    private userInfoService: UserGradeInfoService,
  ) {}

  async generateByArrayGameId(gamesId: string[]) {
    const idMap = new Map<string, number>();
    let indexUserId = 1;
    const workbook = new exceljs.Workbook();
    const worksheet: exceljs.Worksheet[] = [];
    for (const gameId of gamesId) {
      const game = await this.gameService.getByGameId(gameId);
      const gameStatistic =
        await this.statisticService.getStatisticsByGameId(gameId);
      if (!gameStatistic) {
        continue;
      }
      for (const level of gameStatistic.result) {
        if (!worksheet[level.position]) {
          worksheet.push(workbook.addWorksheet('Этап ' + (level.position + 1)));
          const criteria: string[] = [];
          criteria.push('id');
          if (game && game.isRequestUserGradeInfo)
            criteria.push('возраст и пол');
          for (const c of level.grade.criteria) {
            criteria.push(c.text);
          }
          worksheet[level.position].addRow(criteria);
        }

        for (const result of level.statistics) {
          if (!idMap.has(result.userCode)) {
            idMap.set(result.userCode, indexUserId);
            indexUserId++;
          }
          const id = idMap.get(result.userCode);
          if (game && game.isRequestUserGradeInfo) {
            const userInfo = await this.userInfoService.get(result.userCode);
            const info: string[] = [];
            info.push(id.toString());
            if (userInfo) {
              info.push(`${userInfo.age}, ${userInfo.gender}`);
            }
            worksheet[level.position].addRow([...info, ...result.answer]);
          } else {
            worksheet[level.position].addRow([id, ...result.answer]);
          }
        }
        worksheet[level.position].getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
        });
      }
    }
    // worksheet.getRow(1).eachCell((cell) => {
    //   cell.font = { bold: true };
    // });
    const file = await new Promise((resolve, reject) => {
      tmp.file(
        {
          discardDescription: true,
          prefix: 'statistic_game',
          postfix: '.xlsx',
          mode: parseInt('0600', 8),
        },
        async (err, file) => {
          if (err) {
            console.log(err);
            throw new BadRequestException(err);
          }
          workbook.xlsx
            .writeFile(file)
            .then(() => {
              resolve(file);
            })
            .catch((err) => {
              console.log(err);
              throw new BadRequestException(err);
            });
        },
      );
    });
    return file;
  }

  async generate(gameId: string) {
    const game = await this.gameService.getByGameId(gameId);
    const idMap = new Map<string, number>();
    let indexUserId = 1;
    const gameStatistic =
      await this.statisticService.getStatisticsByGameId(gameId);
    if (!gameStatistic) {
      throw new BadRequestException('нет статитстики');
    }
    const workbook = new exceljs.Workbook();
    for (const level of gameStatistic.result) {
      const worksheet = workbook.addWorksheet('Этап ' + (level.position + 1));
      // worksheet.addRow(['Этап ' + (level.position + 1)]).eachCell((cell) => {
      //   cell.font = { bold: true };
      // });
      const criteria: string[] = [];
      criteria.push('id');
      if (game && game.isRequestUserGradeInfo) criteria.push('возраст и пол');
      for (const c of level.grade.criteria) {
        criteria.push(c.text);
      }
      worksheet.addRow(criteria);
      for (const result of level.statistics) {
        if (!idMap.has(result.userCode)) {
          idMap.set(result.userCode, indexUserId);
          indexUserId++;
        }
        const id = idMap.get(result.userCode);
        if (game && game.isRequestUserGradeInfo) {
          const userInfo = await this.userInfoService.get(result.userCode);
          const info: string[] = [];
          info.push(id.toString());
          if (userInfo) {
            info.push(`${userInfo.age}, ${userInfo.gender}`);
          }
          worksheet.addRow([...info, ...result.answer]);
        } else {
          worksheet.addRow([id, ...result.answer]);
        }
      }
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
    }
    // worksheet.getRow(1).eachCell((cell) => {
    //   cell.font = { bold: true };
    // });
    const file = await new Promise((resolve, reject) => {
      tmp.file(
        {
          discardDescription: true,
          prefix: 'statistic_game',
          postfix: '.xlsx',
          mode: parseInt('0600', 8),
        },
        async (err, file) => {
          if (err) {
            console.log(err);
            throw new BadRequestException(err);
          }
          workbook.xlsx
            .writeFile(file)
            .then(() => {
              resolve(file);
            })
            .catch((err) => {
              console.log(err);
              throw new BadRequestException(err);
            });
        },
      );
    });
    return file;
    // try {
    //   const b = await workbook.xlsx.writeBuffer()
    //   return b
    //   // const data = await workbook.xlsx.writeFile(`${path}/users.xlsx`)
    //   //   .then(() => {
    //   //     // res.send({
    //   //     //   status: "success",
    //   //     //   message: "file successfully downloaded",
    //   //     //   path: `${path}/users.xlsx`,
    //   //     // });
    //   //     console.log( `${path}/users.xlsx`)
    //   //
    //   //
    //   //   });
    // } catch (err) {
    //   // res.send({
    //   //   status: "error",
    //   //   message: "Something went wrong",
    //   // });
    //   return  `${err} error`
    // }
  }
}
