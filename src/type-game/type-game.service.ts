import { BadRequestException, Injectable } from '@nestjs/common';
import { ITypeGame } from './domains/type-game.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypeGameSchemaClass } from './schemas/type-game.schema';

@Injectable()
export class TypeGameService {
  constructor(
    @InjectModel('type_game')
    private readonly typeGameModel: Model<TypeGameSchemaClass>,
  ) {}
  public async getAll() {
    return this.typeGameModel.find().exec();
  }

  public async createTypeGame(typeGame: ITypeGame) {
    const tg = await this.typeGameModel.findOne({ type: typeGame.type });
    if (tg) {
      throw new BadRequestException('Тип с таким названием уже существует');
    }
    return this.typeGameModel.create({ type: typeGame.type });
  }

  public async updateTypeGame(typeGame: ITypeGame) {
    const tg = await this.typeGameModel.findById(typeGame.id);
    if (!tg) {
      throw new BadRequestException('Тип игры не найден');
    }
    await this.typeGameModel.findByIdAndUpdate(typeGame.id, typeGame);
    return this.typeGameModel.findById(typeGame.id);
  }

  public async deleteTypeGame(id: string) {
    const tg = await this.typeGameModel.findById(id);
    if (!tg) {
      throw new BadRequestException('Тип игры не найден');
    }
    return this.typeGameModel.findByIdAndRemove(id);
  }
}
