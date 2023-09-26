import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ImageRoutingService } from './image-routing.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageRoutingController {
  constructor(private readonly imageRoutingService: ImageRoutingService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() options: { type: string },
  ) {
    return this.imageRoutingService.saveFile(file, options.type);
  }
}
