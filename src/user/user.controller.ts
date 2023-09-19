import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './items/user.dto';
import { UserService } from './user.service';
import { UserGuard } from '../guards/user/user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(UserGuard)
  @Get()
  getAllUser() {
    return this.userService.getAll();
  }

  @Get(':role')
  getOne(@Param('role') role: string) {
    return this.userService.getUserByRole(role);
  }

  @Post()
  createUser(@Body() user: UserDto) {
    return this.userService.create(user);
  }

  @Put()
  updateUser(@Body() user: UserDto) {
    return this.userService.update(user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
