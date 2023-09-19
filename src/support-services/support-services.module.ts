import { Module } from '@nestjs/common';
import { PasswordCryptService } from './password-crypt/password-crypt.service';
import { JwtWorkServiceService } from './jwt-work-service/jwt-work-service.service';
import { JwtModule } from "@nestjs/jwt";

import { MongooseModule } from "@nestjs/mongoose";
import { RandomNumberService } from './random-number/random-number.service';
import {configServer} from "../config";


@Module({
  imports:[
    JwtModule.register({global:true, secret:configServer.secret})],
  providers: [PasswordCryptService, JwtWorkServiceService, RandomNumberService],
  exports: [PasswordCryptService, JwtWorkServiceService, RandomNumberService]
})
export class SupportServicesModule {}
