import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GameDto } from './domains/game.dto';
import { GameService } from './game.service';
import { UserGuard } from '../guards/user/user.guard';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Get()
  getAllGames() {
    return this.gameService.getAll();
  }

  @UseGuards(UserGuard)
  @Get('admin')
  getGamesByUserId(@Request() req) {
    const user = req['user'];
    if (!user) {
      throw new BadRequestException('неизвестный пользователь');
    }
    if (user.role === 'super') return this.gameService.getAll();
    else if (user.role === 'admin')
      return this.gameService.getByUserId(req['user'].id);
    throw new BadRequestException('неизвестный пользователь');
  }
  @Post()
  createGame(@Body() task: GameDto) {
    return this.gameService.create(task);
  }

  @Put()
  updateGame(@Body() task: GameDto) {
    return this.gameService.update(task);
  }

  @Delete(':id')
  deleteGame(@Param('id') id: string) {
    return this.gameService.delete(id);
  }
}
