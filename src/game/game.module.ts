import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { SupportServicesModule } from '../support-services/support-services.module';
import { GameService } from './game.service';
import { GameSchema } from './schemas/gameSchemaClass';
import { CodeGameService } from './code-game/code-game.service';
import { CodeGameSchema } from './schemas/code-game-schema';

@Module({
  imports: [
    SupportServicesModule,
    MongooseModule.forFeature([
      { name: 'game', schema: GameSchema },
      { name: 'code-game', schema: CodeGameSchema },
    ]),
    SupportServicesModule,
  ],
  providers: [GameService, CodeGameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
