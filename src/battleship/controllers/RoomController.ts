import { IRoom } from '../types';

export default class RoomController {
  private rooms: IRoom[] = [];

  private lastId = 1;

  public getRooms() {
    return this.rooms.map((room) => {
      const roomUsers = room.users.map((user) => ({
        name: user.name,
        index: user.id,
      }));

      return {
        roomId: room.id,
        roomUsers,
      };
    });
  }
}
