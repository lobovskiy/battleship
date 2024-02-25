import User from '../models/User';
import { IUser } from '../types';

export default class UserController {
  private users: IUser[] = [];

  private lastId = 1;

  public registerUser(name: string, password: string, connectionId: string) {
    return (
      this.users.find(
        (user) => user.name === name && user.password === password
      ) || this.addUser(name, password, connectionId)
    );
  }

  public getWinners() {
    return this.users.map((user) => ({
      name: user.name,
      wins: user.wins,
    }));
  }

  public findUserByConnectionId(connectionId: string): IUser | undefined {
    return this.users.find((user) => user.connectionId === connectionId);
  }

  private addUser(name: string, password: string, connectionId: string): IUser {
    const id = this.lastId++;
    const user = new User(id, name, password, connectionId);

    this.users.push(user);

    return user;
  }
}
