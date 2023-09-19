import { ISocketAdmin, ISocketUser } from './socket-user.interface';
import { Socket } from 'socket.io';
import { IUser } from '../../user/items/users.interface';

export class SocketAdmin implements ISocketAdmin {
  id: string;
  socket: Socket | null;
  user: IUser | null;
  constructor(socket: Socket | null, user: IUser | null) {
    this.id = socket?.id ?? '';
    this.socket = socket;
    this.user = user;
  }
}

export class SocketUser implements ISocketUser {
  id: string | null;
  socket: Socket | null;
  userCode: string;
  teamCode: number;
  userType: string;
  constructor(
    socket: Socket | null,
    userCode: string,
    teamCode: number,
    userType: string,
  ) {
    this.id = socket?.id ?? '';
    this.socket = socket;
    this.userCode = userCode;
    this.teamCode = teamCode;
    this.userType = userType;
  }
}
