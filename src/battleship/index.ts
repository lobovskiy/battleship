import WebSocket from 'ws';
import { ServerError } from './models/errors';
import AppController from './controllers/AppController';
import { handleError, parseWsMessageData } from './utils';
import { IAppWsServer, IWsApp, IWsConnection } from '../types';
import { Actions } from './types';

export class Battleship implements IWsApp {
  private controller: AppController;

  constructor(public wsServer: IAppWsServer) {
    this.controller = new AppController(wsServer);
  }

  listen() {
    this.wsServer.on('connection', (ws) => {
      const wsConnection = this.wsServer.createWsConnection(ws);

      ws.on('message', (data) => this.handleClientMessage(data, wsConnection));
    });
  }

  handleClientMessage(data: WebSocket.RawData, wsConnection: IWsConnection) {
    try {
      const message = parseWsMessageData(data);
      const { type: action, data: messageData } = message;

      switch (action) {
        case Actions.RegisterUser:
          this.controller.registerUser(messageData, wsConnection);
          this.controller.updateRooms();
          this.controller.updateWinners();

          break;
        case Actions.CreateRoom:
          this.controller.createRoom(wsConnection);
          this.controller.updateRooms();

          break;
        case Actions.AddUserToRoom:
          const roomUsers = this.controller.addUserToRoom(
            messageData,
            wsConnection
          );
          this.controller.updateRooms();

          if (roomUsers.length === 2) {
            this.controller.createGame(messageData.indexRoom, wsConnection);
          }

          break;
        case Actions.AddShips:
          const canStartGame = this.controller.addShips(
            messageData,
            wsConnection
          );

          if (canStartGame) {
            this.controller.startGame(messageData.gameId, wsConnection);
          }

          break;

        default:
          handleError(new ServerError('Unsupported action'), wsConnection);
      }
    } catch (error) {
      handleError(error, wsConnection);
    }
  }
}
