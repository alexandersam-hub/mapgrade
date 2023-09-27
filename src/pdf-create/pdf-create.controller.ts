import {Controller, Get, Header, Param, Req, Res} from '@nestjs/common';
import { PdfCreateService } from './pdf-create.service';
import { Response } from 'express';

@Controller('pdf-create')
export class PdfCreateController {
  constructor(private pdfService: PdfCreateService) {}
  @Get(':game')
  @Header('Content-type', 'text/xlsx')
  async generateQr(@Res() res: Response, @Req() req: Request, @Param('game') gameData: string) {
    const url = req.headers['referrer'] || req.headers['referer'];
    const file = await this.pdfService.generatePDF(gameData, url);
    res.download(`${file}`);
  }
}
