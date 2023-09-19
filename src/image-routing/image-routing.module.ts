import { Module } from '@nestjs/common';
import { ImageRoutingService } from './image-routing.service';
import { ImageRoutingController } from './image-routing.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

@Module({
  providers: [ImageRoutingService],
  controllers: [ImageRoutingController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
    }),
  ],
})
export class ImageRoutingModule {}
