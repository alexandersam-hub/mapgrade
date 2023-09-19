import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}
  @Get('/:id')
  async getStatistics(@Param('id') id: string) {
    return this.statisticService.getStatisticsByGameId(id);
  }
}
