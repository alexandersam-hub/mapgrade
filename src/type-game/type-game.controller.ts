import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TypeGameService } from './type-game.service';
import { TypeGameDto } from './domains/type-game.dto';

@Controller('type-game')
export class TypeGameController {
  constructor(private typeGameService: TypeGameService) {}

  @Get()
  getTypeGames() {
    return this.typeGameService.getAll();
  }
  @Post()
  createTypeGame(@Body() typeGame: TypeGameDto) {
    return this.typeGameService.createTypeGame(typeGame);
  }
  @Put()
  updateTypeGame(@Body() typeGame: TypeGameDto) {
    return this.typeGameService.updateTypeGame(typeGame);
  }
  @Delete(':id')
  deleteTypeGame(@Param('id') id: string) {
    return this.typeGameService.deleteTypeGame(id);
  }
}
