import { IRoom, IUser } from '../types';

export class Room implements IRoom {
  private users: IUser[] = [];

  constructor(
    public id: number,
    user?: IUser
  ) {
    if (user) {
      this.users.push(user);
    }
  }

  public getUsers() {
    return this.users.map((user) => ({
      name: user.name,
      index: user.id,
    }));
  }
}
