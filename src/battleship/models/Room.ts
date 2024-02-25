import { IRoom, IUser } from '../types';

export class Room implements IRoom {
  constructor(
    public id: number,
    public users: IUser[]
  ) {}
}
