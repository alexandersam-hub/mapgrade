import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}
  @Get(':id')
  async getStatisticByGame(@Param('id') id: string) {
    return this.statisticService.getStatisticsByGameId(id);
  }

  @Get()
  async getStatistics() {
    return this.statisticService.getStatistics();
  }
}
