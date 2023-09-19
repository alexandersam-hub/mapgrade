import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameDto } from '../domains/game.dto';
import { CodeGame } from '../domains/code-game.dto';

@Injectable()
export class CodeGameService {
  constructor(
    @InjectModel('code-game') readonly codeGameModel: Model<CodeGame>,
  ) {}
  public async getNextCode() {
    const codeGame = await this.codeGameModel.findOne();
    let code = 100;
    if (codeGame) {
      code = codeGame.code + 1;
      await this.codeGameModel.findOneAndUpdate({}, { code });
    } else {
      await this.createCode(code);
    }
    return code;
  }

  private async createCode(startNumber: number) {
    await this.codeGameModel.create({ code: startNumber });
  }
}
