import { Controller, Get, Header, Param, Res } from '@nestjs/common';
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
}
