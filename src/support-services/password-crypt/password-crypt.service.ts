import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import {configServer} from "../../config";
@Injectable()
export class PasswordCryptService {
  private readonly salt
  constructor() {
    this.salt = configServer.salt
  }
  async generateHash (password:string):Promise<string>{
    return bcrypt.hash(password, this.salt)
  }

  async confirmPassword(password1: string, password2: string):Promise<boolean>{
    try{
      const result = await bcrypt.compare(password1, password2)
      return result
    }catch (e) {
      console.log(e);
      return false;
    }

  }
}
