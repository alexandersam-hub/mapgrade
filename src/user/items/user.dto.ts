import { IsEnum, IsNotEmpty } from 'class-validator';
import { IUser } from './users.interface';
import { UserRoleEnum } from './roles';

export class UserDto implements IUser {
  id: string;

  @IsNotEmpty({ message: 'не заполнен логин' })
  login: string;

  @IsNotEmpty({ message: 'не заполнен пароль' })
  readonly password: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty({ message: 'не заполнена роль' })
  readonly role: UserRoleEnum;

  stringName: string;
}
