import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ILoginData } from './items/login-data.interface';
import { UserService } from './user.service';

@Controller('login')
export class LoginController {
  constructor(private userService: UserService) {}
  @Post()
  login(@Body() loginData: ILoginData) {
    if (!loginData) {
      throw new BadRequestException('не заданы поля авторизации');
    }
    return this.userService.login(loginData);
  }
}
