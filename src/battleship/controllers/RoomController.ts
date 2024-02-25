import { IRoom, IUser } from '../types';
import { Room } from '../models/Room';
import { RoomNotFoundError } from '../models/errors';

export default class RoomController {
  private rooms: IRoom[] = [];

  private lastId = 1;

  public getRooms() {
    return this.rooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.getUsers(),
    }));
  }

  public findRoomById(id: number) {
    return this.rooms.find((room) => room.id === id);
  }

  public addNewRoom(user?: IUser): IRoom {
    const id = this.lastId++;
    const room = new Room(id, user);

    this.rooms.push(room);

    return room;
  }

  public addUserToRoom(user: IUser, roomId: number) {
    const room = this.rooms.find((room) => room.id === roomId);

    if (!room) {
      throw new RoomNotFoundError();
    }

    return room.addUser(user);
  }
}
