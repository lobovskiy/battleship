import { IRoom, IUser } from '../types';
import { Room } from '../models/Room';

export default class RoomController {
  private rooms: IRoom[] = [];

  private lastId = 1;

  public getRooms() {
    return this.rooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.getUsers(),
    }));
  }

  public addRoom(user?: IUser): IRoom {
    const id = this.lastId++;
    const room = new Room(id, user);

    this.rooms.push(room);

    return room;
  }
}
