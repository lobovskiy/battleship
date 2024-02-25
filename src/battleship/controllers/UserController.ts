import User from '../models/User';
import { IUser } from '../types';
import { UserNotFoundError } from '../models/errors';

export default class UserController {
  private users: IUser[] = [];

  private lastId = 1;

  public registerUser(name: string, password: string, connectionId: string) {
    return (
      this.users.find(
        (user) => user.name === name && user.password === password
      ) || this.addNewUser(name, password, connectionId)
    );
  }

  public getWinners() {
    return this.users.map((user) => ({
      name: user.name,
      wins: user.wins,
    }));
  }

  public getUserByConnectionId(connectionId: string) {
    const user = this.users.find((user) => user.connectionId === connectionId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  private addNewUser(
    name: string,
    password: string,
    connectionId: string
  ): IUser {
    const id = this.lastId++;
    const user = new User(id, name, password, connectionId);

    this.users.push(user);

    return user;
  }
}
