import { IUser } from '../types';

export default class User implements IUser {
  constructor(
    public id: number,
    public name: string,
    public password: string,
    public connectionId: string
  ) {}
}
