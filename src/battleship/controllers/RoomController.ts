import { IClientAttackData, IGame, IRoom, IShipData, IUser } from '../types';
import { Room } from '../models/Room';
import { GameNotFoundError, RoomNotFoundError } from '../models/errors';

export default class RoomController {
  private rooms: IRoom[] = [];

  private lastId = 1;

  public getRooms() {
    return this.rooms
      .map((room) => ({
        roomId: room.id,
        roomUsers: room.getUsers(),
      }))
      .filter((roomData) => roomData.roomUsers.length < 2);
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

  public addShipsToBot(roomId: number, botUserId: number) {
    const room = this.getRoomById(roomId);

    return room.addUserShipsToBot(botUserId);
  }

  public getRoomGameCurrentPlayerId(roomId: number) {
    const game = this.getRoomGameByRoomId(roomId);

    return game.currentPlayerId;
  }

  public getRoomGamePlayers(roomId: number) {
    const game = this.getRoomGameByRoomId(roomId);

    return game.getPlayers();
  }

  public getRoomGamePlayerShipsDataset(roomId: number, userId: number) {
    const game = this.getRoomGameByRoomId(roomId);
    const gameBoard = game.getPlayerGameBoard(userId);

    return gameBoard.shipDataset;
  }

  public gameAttack(data: IClientAttackData) {
    const { gameId, x, y } = data;
    const game = this.getRoomGameByRoomId(gameId);

    return game.attack(x, y);
  }

  public getRoomGameRandomAttackCoords(roomId: number) {
    const game = this.getRoomGameByRoomId(roomId);

    return game.getRandomAttackCoords();
  }

  public isRoomGameOver(roomId: number) {
    const game = this.getRoomGameByRoomId(roomId);

    return game.isGameOver();
  }

  public deleteRoom(roomId: number) {
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
  }

  public getRoomGameWinnerId(roomId: number) {
    const game = this.getRoomGameByRoomId(roomId);

    return game.winnerId;
  }

  public getRoomsByUserConnectionId(connectionId: string) {
    const games: IRoom[] = [];

    this.rooms.forEach((room) => {
      const user = room.findUserByConnectionId(connectionId);

      if (user) {
        games.push(room);
      }
    });

    return games;
  }

  private getRoomById(id: number) {
    const room = this.rooms.find((room) => room.id === id);

    if (!room) {
      throw new RoomNotFoundError();
    }

    return room;
  }

  private getRoomGameByRoomId(id: number) {
    const { game } = this.getRoomById(id);

    if (!game) {
      throw new GameNotFoundError();
    }

    return game;
  }
}
