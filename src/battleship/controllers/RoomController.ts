import { IRoom, IShipData, IUser } from '../types';
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

  public addNewRoom(user: IUser): IRoom {
    const id = this.lastId++;
    const room = new Room(id, user);

    this.rooms.push(room);

    return room;
  }

  public createGame(roomId: number) {
    const room = this.getRoomById(roomId);

    room.initGame();
  }

  public addUserToRoom(user: IUser, roomId: number) {
    const room = this.getRoomById(roomId);

    return room.addUser(user);
  }

  public addUserShipsToRoom(
    shipDataset: IShipData[],
    userId: number,
    roomId: number
  ) {
    const room = this.getRoomById(roomId);

    return room.addUserShips(shipDataset, userId);
  }

  private getRoomById(id: number) {
    const room = this.rooms.find((room) => room.id === id);

    if (!room) {
      throw new RoomNotFoundError();
    }

    return room;
  }
}
