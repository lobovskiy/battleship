import User from '../models/User';
import { IUser } from '../types';
import { UserNotFoundError } from '../models/errors';

export default class UserController {
  private users: IUser[] = [];

  private lastId = 1;

  public registerUser(
    name: string,
    password: string,
    connectionId: string,
    onUserExists: (oldConnectionId: string) => void
  ) {
    const existingUser = this.users.find(
      (user) => user.name === name && user.password === password
    );

    if (existingUser) {
      onUserExists(existingUser.connectionId);
      existingUser.connectionId = connectionId;

      return existingUser;
    } else {
      return this.addNewUser(name, password, connectionId);
    }
  }

  public getWinners() {
    return this.users
      .filter((user) => !user.bot)
      .map((user) => ({
        name: user.name,
        wins: user.wins,
      }));
  }

  public findUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  public getUserByConnectionId(connectionId: string) {
    const user = this.users.find((user) => user.connectionId === connectionId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  public createBot() {
    return this.addNewUser(
      `Bot ${this.lastId}`,
      `Bot ${this.lastId}`,
      '',
      true
    );
  }

  private addNewUser(
    name: string,
    password: string,
    connectionId: string,
    bot: boolean = false
  ): IUser {
    const id = this.lastId++;
    const user = new User(id, name, password, connectionId, bot);

    this.users.push(user);

    return user;
  }
}
