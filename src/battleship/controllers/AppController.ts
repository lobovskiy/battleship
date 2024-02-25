import WebSocket from 'ws';
import UserController from './UserController';
import RoomController from './RoomController';
import { getServerMessageFromPayload, sendServerMessage } from '../utils';
import { IAppWsServer, IWsConnection } from '../../types';
import { Actions, IClientUserData, MessagePayload } from '../types';

export default class AppController {
  constructor(
    private userController: UserController,
    private roomController: RoomController,
    private wsServer: IAppWsServer
  ) {}

  public registerUser(data: IClientUserData, wsConnection: IWsConnection) {
    const user = this.userController.registerUser(
      data.name,
      data.password,
      wsConnection.id
    );
    const payloadData = { name: user.name, index: user.id };
    const payload: MessagePayload = {
      type: Actions.Register,
      data: JSON.stringify(payloadData),
    };

    sendServerMessage(payload, wsConnection);
  }

  private updateRooms(wsConnection: IWsConnection) {
    const payload: MessagePayload = {
      type: Actions.UpdateRoom,
      data: JSON.stringify(''),
    };
    const serverMessage = getServerMessageFromPayload(payload);

    this.broadcast(serverMessage);
  }

  private updateWinners(wsConnection: IWsConnection) {
    const payload: MessagePayload = {
      type: Actions.UpdateWinners,
      data: JSON.stringify(''),
    };
    const serverMessage = getServerMessageFromPayload(payload);

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
