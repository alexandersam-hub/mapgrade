import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
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
}
