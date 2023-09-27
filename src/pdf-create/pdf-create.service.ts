import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';
import * as tmp from 'tmp';
import { GameService } from '../game/game.service';
@Injectable()
export class PdfCreateService {
  constructor(private gameService: GameService) {}
  async generatePDF(gameId: string, url: string) {
    const fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
      },
    };
    const game = await this.gameService.getByGameId(gameId);
    if (!game) {
      throw new BadRequestException('игры не найдено');
    }
    const code = game.code;
    const countTeam = game.countTeam;
    const content = [];
    if (game.isAutoTeam) {
      content.push({
        text: 'код игры: ' + code,
        fontSize: 30,
        style: 'header',
        alignment: 'center',
        margin: [30, 20, 20, 30],
      });
      content.push({
        qr: `${url}authorization/${code}`,
        fit: 300,
        foreground: 'black',
        background: 'white',
        alignment: 'center',
      });
      content.push({
        text: url,
        margin: [10, 30, 15, 20],
        fontSize: 30,
        style: 'header',
        alignment: 'center',
      });
    } else {
      for (let i = 0; i < countTeam; i++) {
        content.push({
          text: 'команда: ' + (i + 1),
          fontSize: 30,
          style: 'header',
          alignment: 'center',
          margin: [30, 20, 20, 30],
        });
        content.push({
          qr: `${url}authorization/${code}/${i}`,
          fit: 300,
          foreground: 'black',
          background: 'white',
          alignment: 'center',
        });
        content.push({
          text: url,
          margin: [10, 30, 15, 20],
          fontSize: 30,
          style: 'header',
          alignment: 'center',
        });
        content.push({
          text: 'код игры: ' + code,
          fontSize: 30,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 0],
        });
        if (i + 1 !== countTeam) {
          content.push({ pageBreak: 'before', text: '' });
        }
      }
    }

    const printer = new PdfPrinter(fonts);
    const docDefinition = {
      content: content,
      defaultStyle: {
        font: 'Roboto',
      },
      style: {
        header: {
          bold: true,
        },
      },
    };
    const file = await new Promise((resolve, reject) => {
      tmp.file(
        {
          discardDescription: true,
          prefix: 'qr_game',
          postfix: '.pdf',
          mode: parseInt('0600', 8),
        },
        async (err, file) => {
          if (err) {
            console.log(err);
            throw new BadRequestException(err);
          }
          const options = {};
          const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
          const writeStream = fs.createWriteStream(file);

          pdfDoc.pipe(writeStream);
          writeStream.on('finish', function () {
            console.log(file);
            resolve(file);
          });
          pdfDoc.end();
        },
      );
    });
    return file;
    // const options = {};
    // const file_name = 'PDF' + '_10' + '.pdf';
    // const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    // pdfDoc.pipe(fs.createWriteStream(file_name));
    // pdfDoc.end();
    // return { file_name: file_name };
  }
}
