import { Socket } from 'socket.io';
import { IUser } from '../../user/items/users.interface';

export interface ISocketUser {
  id: string | null;
  socket: Socket | null;
  userCode: string;
  teamCode: number;
  userType: string;
}

export interface ISocketAdmin {
  id: string;
  socket: Socket | null;
  user: IUser | null;
}
