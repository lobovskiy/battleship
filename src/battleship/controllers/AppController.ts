import WebSocket from 'ws';
import UserController from './UserController';
import RoomController from './RoomController';
import {
  createMessagePayload,
  createServerMessage,
  sendServerMessage,
} from '../utils';
import { IAppWsServer, IWsConnection } from '../../types';
import { Actions, IClientRoomData, IClientUserData } from '../types';
import { UserNotFoundError } from '../models/errors';

export default class AppController {
  private userController: UserController;

  private roomController: RoomController;

  constructor(private wsServer: IAppWsServer) {
    this.userController = new UserController();
    this.roomController = new RoomController();
  }

  public registerUser(data: IClientUserData, wsConnection: IWsConnection) {
    const user = this.userController.registerUser(
      data.name,
      data.password,
      wsConnection.id
    );
    const payload = createMessagePayload(Actions.RegisterUser, {
      name: user.name,
      index: user.id,
    });

    sendServerMessage(payload, wsConnection);
  }

  public createRoom(wsConnection: IWsConnection) {
    const user = this.userController.findUserByConnectionId(wsConnection.id);

    this.roomController.addRoom(user);
  }

  public addUserToRoom(data: IClientRoomData, wsConnection: IWsConnection) {
    const user = this.userController.findUserByConnectionId(wsConnection.id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.roomController.addUserToRoom(user, data.indexRoom);
  }

  public updateRooms() {
    const payload = createMessagePayload(
      Actions.UpdateRooms,
      this.roomController.getRooms()
    );
    const serverMessage = createServerMessage(payload);

    this.broadcast(serverMessage);
  }

  public updateWinners() {
    const payload = createMessagePayload(
      Actions.UpdateWinners,
      this.userController.getWinners()
    );
    const serverMessage = createServerMessage(payload);

    this.broadcast(serverMessage);
  }

  private broadcast(data: string) {
    this.wsServer.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }
}
