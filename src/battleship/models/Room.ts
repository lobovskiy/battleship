import User from './User';

export class Room {
  constructor(
    public id: number,
    public users: User[]
  ) {}
}
