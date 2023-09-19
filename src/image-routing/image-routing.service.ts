import { Injectable } from '@nestjs/common';
import { v4 as uuidv1 } from 'uuid';
import { FileElementResponse } from './dto/file-element.response';
import { path } from 'app-root-path';
import { ensureDir, writeFile, remove } from 'fs-extra';
@Injectable()
export class ImageRoutingService {
  constructor() {}

  async saveFile(
    file: Express.Multer.File,
    type: string,
  ): Promise<FileElementResponse> {
    const uploadFolder = `${path}/uploads/${type}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponse = new FileElementResponse();
    const timeStamp = uuidv1();
    const newFileName = `${timeStamp}${
      file.originalname.substring(file.originalname.lastIndexOf('.')) ?? ''
    }`;
    await writeFile(`${uploadFolder}/${newFileName}`, file.buffer);
    res.name = newFileName;
    return res;
  }

  async deleteListFiles(filesNames: string[]) {
    for (const file of filesNames) {
      await this.deleteFile(file);
    }
    return { status: true };
  }

  private async deleteFile(fileName: string) {
    await remove(`${path}/uploads/${fileName}`);
  }

  // async getImageById(id: string) {}
}
