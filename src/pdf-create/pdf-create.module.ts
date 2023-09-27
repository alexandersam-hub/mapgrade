import { Module } from '@nestjs/common';
import { PdfCreateService } from './pdf-create.service';
import { PdfCreateController } from './pdf-create.controller';
import {GameModule} from "../game/game.module";

@Module({
  providers: [PdfCreateService],
  controllers: [PdfCreateController],
  imports: [GameModule],
})
export class PdfCreateModule {}
