import { IUser } from '../types';

export default class User implements IUser {
  public wins = 0;

  constructor(
    public id: number,
    public name: string,
    public password: string,
    public connectionId: string,
    public bot?: boolean
  ) {}
}
