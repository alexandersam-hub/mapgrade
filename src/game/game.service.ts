import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GameDto } from './domains/game.dto';
import { CodeGameService } from './code-game/code-game.service';
import { IGame } from './domains/game.interface';

@Injectable()
export class GameService {
  constructor(
    @InjectModel('game') readonly gameModel: Model<GameDto>,
    private codeGameService: CodeGameService,
  ) {}
  async getAll() {
    return this.gameModel.find();
  }

  async getByUserId(id: string) {
    return this.gameModel.find({ master: id });
  }
  public async getByGameId(id: string): Promise<GameDto> | null {
    const game = await this.gameModel.findById(id);
    if (game) return JSON.parse(JSON.stringify(game));
    else return null;
  }

  public async getFullFieldByGameId(id: string): Promise<IGame> | null {
    const game = await this.gameModel.findById(id);
    if (game) return JSON.parse(JSON.stringify(game));
    else return null;
  }

  async create(game: GameDto) {
    const oldGame = await this.gameModel.findOne({ username: game.title });
    if (oldGame) {
      throw new BadRequestException(
        'Игра с указанным названием уже существует',
      );
    }
    game.id = new mongoose.Types.ObjectId().toString();
    game.code = await this.codeGameService.getNextCode();
    return this.gameModel.create(game);
  }

  async update(game: GameDto) {
    const oldTask = await this.gameModel.findById(game.id);
    if (!oldTask) {
      throw new BadRequestException('Игры не существует');
    }
    if (!Number.isInteger(game.code)) {
      game.code = await this.codeGameService.getNextCode();
    }
    await this.gameModel.findByIdAndUpdate(game.id, game);
    return this.gameModel.findById(game.id);
  }

  async delete(gameId: string) {
    return this.gameModel.findByIdAndRemove(gameId);
  }

  async getByCodeGame(codeGame: number) {
    const game = await this.gameModel.findOne({ code: codeGame });
    if (game) return JSON.parse(JSON.stringify(game));
    else return null;
  }
}
