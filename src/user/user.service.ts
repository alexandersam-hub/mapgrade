import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserDto } from './items/user.dto';
import { ILoginData } from './items/login-data.interface';
import { IUser } from './items/users.interface';
import { JwtWorkServiceService } from '../support-services/jwt-work-service/jwt-work-service.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') readonly userModel: Model<UserDto>,
    private jwtService: JwtWorkServiceService,
  ) {}

  async getAll() {
    return this.userModel.find();
  }
  public async getUserByToken(token: string): Promise<IUser> | null {
    try {
      const userFromToken = await this.jwtService.decodeJwt(token);
      if (!userFromToken) return null;
      const userBd = await this.userModel.findById(userFromToken.id);
      if (!userBd) return null;
      return JSON.parse(JSON.stringify(userBd));
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getOne(id: string) {
    return this.userModel.findById(id);
  }

  async getUserByRole(role) {
    return this.userModel.find({ role });
  }

  async create(user: UserDto) {
    const oldUser = await this.userModel.findOne({ username: user.login });
    if (oldUser) {
      throw new BadRequestException(
        'Пользоветль с указанным именем уже существует',
      );
    }
    user.login = user.login.toLowerCase();
    user.id = new mongoose.Types.ObjectId().toString();
    return this.userModel.create(user);
  }

  async update(user: UserDto) {
    const oldUser = await this.userModel.findById(user.id);
    if (!oldUser) {
      throw new BadRequestException('Пользователь не существует');
    }
    user.login = user.login.toLowerCase();
    await this.userModel.findByIdAndUpdate(user.id, user);
    return this.userModel.findById(user.id);
  }

  async delete(userId: string) {
    return this.userModel.findByIdAndRemove(userId);
  }

  async login(loginData: ILoginData) {
    const candidate: IUser = await this.userModel.findOne({
      login: loginData.login.toLowerCase(),
    });
    if (candidate) {
      if (candidate.password === loginData.password) {
        return {
          token: await this.jwtService.generateJwtToken(
            JSON.parse(JSON.stringify(candidate)),
          ),
        };
      } else {
        throw new BadRequestException('некорректный пароль');
      }
    } else {
      throw new BadRequestException('Пользователь не найден');
    }
  }
}
