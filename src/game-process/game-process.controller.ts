import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { GameProcessService } from './game-process.service';

@Controller('game-process')
export class GameProcessController {
  constructor(private gameProgressService: GameProcessService) {}
  @Post('login')
  async loginGamer(@Body() message: { code: string }) {
    const code = parseInt(message.code);
    if (Number.isInteger(code)) {
      return await this.gameProgressService.loginGamerByCode(code);
    } else throw new BadRequestException('неверный формат кода игры');
  }
  @Get()
  getGamesInfo() {
    return this.gameProgressService.getGamesInfo();
  }
  @Delete(':id')
  deleteGameInfo(@Param('id') id: string) {
    return this.gameProgressService.deleteGame(id);
  }
}
