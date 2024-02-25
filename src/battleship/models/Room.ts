import { IRoom, IServerUserData, IUser } from '../types';
import { RoomUserQtyError } from './errors';

export class Room implements IRoom {
  private users: IUser[] = [];

  constructor(
    public id: number,
    user?: IUser
  ) {
    if (user) {
      this.addUser(user);
    }
  }

  public getUsers(): IServerUserData[] {
    return this.users.map((user) => ({
      name: user.name,
      index: user.id,
    }));
  }

  public addUser(user: IUser): IServerUserData[] {
    if (this.users.length >= 2) {
      throw new RoomUserQtyError();
    }

    if (!this.users.some((roomUser) => roomUser === user)) {
      this.users.push(user);
    }

    return this.getUsers();
  }
}
