import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStatistic, IStatisticResult } from './domains/statistic.interface';
import { Statistic } from './schemas/statistic';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel('statistic')
    private readonly statisticModel: Model<Statistic>,
  ) {}

  public async getStatistics(): Promise<Statistic[]> {
    return this.statisticModel.find().exec();
  }
  public async getStatisticsByGameId(gameId: string): Promise<Statistic> {
    return this.statisticModel.findOne({ game: gameId }).exec();
  }

  public async saveStatisticByGameId(
    gameId: string,
    statisticResult: IStatisticResult[],
  ) {
    const statistic = await this.statisticModel.findOne({ game: gameId });
    if (statistic) {
      await this.statisticModel.findOneAndUpdate(
        { game: gameId },
        { result: statisticResult },
      );
    } else {
      await this.statisticModel.create({
        game: gameId,
        result: statisticResult,
      });
    }
  }

  public async saveStatistics(statistic: IStatistic): Promise<Statistic> {
    const createdStatistic = await this.statisticModel.create(statistic);
    return createdStatistic;
  }

  public async deleteStatistic(id: string) {
    const deletedStatistic = await this.statisticModel
      .findByIdAndRemove(id)
      .exec();
    return deletedStatistic;
  }
}
