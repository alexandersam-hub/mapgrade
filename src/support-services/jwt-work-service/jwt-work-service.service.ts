import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../../user/items/users.interface';

@Injectable()
export class JwtWorkServiceService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(payload: IUser): Promise<string> | null {
    try {
      return this.jwtService.signAsync(payload);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async decodeJwt(jwtString: string): Promise<IUser> | null {
    try {
      const user = await this.jwtService.verifyAsync<IUser>(jwtString);
      return user;
    } catch (e) {
      console.log('!!!!', e);
      return null;
    }
  }
}
