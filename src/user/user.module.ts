import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { SupportServicesModule } from '../support-services/support-services.module';
import { UserService } from './user.service';
import { LoginController } from './login.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    SupportServicesModule,
  ],
  providers: [UserService],
  controllers: [UserController, LoginController],
  exports: [UserService],
})
export class UserModule {}
