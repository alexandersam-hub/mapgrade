import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ExcelGenerateService } from './excel-generate.service';
import { Response } from 'express';

@Controller('excel')
export class ExcelGenerateController {
  constructor(private excelService: ExcelGenerateService) {}
  @Get(':id')
  @Header('Content-type', 'text/xlsx')
  async getExcel(@Res() res: Response, @Param('id') gameId: string) {
    const file = await this.excelService.generate(gameId);
    res.download(`${file}`);
  }
  @Get('games/:id')
  @Header('Content-type', 'text/xlsx')
  async getExcelGames(@Res() res: Response, @Param('id') gamesString: string) {
    const games = JSON.parse(gamesString);
    const file = await this.excelService.generateByArrayGameId(games);
    res.download(`${file}`);
  }
}
