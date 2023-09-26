import { Module } from '@nestjs/common';
import { TypeGameService } from './type-game.service';
import { TypeGameController } from './type-game.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeGameSchema } from './schemas/type-game.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'type_game', schema: TypeGameSchema }]),
  ],
  providers: [TypeGameService],
  controllers: [TypeGameController],
})
export class TypeGameModule {}
