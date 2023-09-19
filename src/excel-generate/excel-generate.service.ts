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
  async generate(gameId: string) {
    const game = await this.gameService.getByGameId(gameId);
    const gameStatistic =
      await this.statisticService.getStatisticsByGameId(gameId);
    if (!gameStatistic) {
      throw new BadRequestException('нет статитстики');
    }
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('результаты опросов');
    for (const level of gameStatistic.result) {
      worksheet.addRow(['Этап ' + (level.position + 1)]).eachCell((cell) => {
        cell.font = { bold: true };
      });
      const criteria: string[] = [];
      if (game && game.isRequestUserGradeInfo) criteria.push('возраст и пол');
      for (const c of level.grade.criteria) {
        criteria.push(c.text);
      }
      worksheet.addRow(criteria);
      for (const result of level.statistics) {
        if (game && game.isRequestUserGradeInfo) {
          const userInfo = await this.userInfoService.get(result.userCode);
          const info: string[] = [];
          if (userInfo) {
            info.push(`${userInfo.age}, ${userInfo.gender}`);
          }
          worksheet.addRow([...info, ...result.answer]);
        } else {
          worksheet.addRow(result.answer);
        }
      }
      worksheet.addRow([]);
    }
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
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
