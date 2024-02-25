import { IGame, IRoom, IServerUserData, IShipData, IUser } from '../types';
import {
  GameNotFoundError,
  RoomLimitUsersError,
  RoomUserQtyError,
} from './errors';
import Game from '../game';

export class Room implements IRoom {
  private users: IUser[] = [];

  public game: IGame | undefined;

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
      throw new RoomLimitUsersError();
    }

    if (!this.users.some((roomUser) => roomUser === user)) {
      this.users.push(user);
    }

    return this.getUsers();
  }

  public initGame() {
    if (this.users.length !== 2) {
      throw new RoomUserQtyError();
    }

    this.game = new Game(this.users[0], this.users[1]);
  }

  public addUserShips(shipDataset: IShipData[], userId: number) {
    if (!this.game) {
      throw new GameNotFoundError();
    }

    return this.game.addShips(shipDataset, userId);
  }
}
