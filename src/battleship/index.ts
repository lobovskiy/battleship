import WebSocket from 'ws';
import { ServerError } from './models/errors';
import { handleError, parseWsMessageData } from './utils';
import { IAppWsServer, IWsApp, IWsConnection } from '../types';

export class Battleship implements IWsApp {
  constructor(public wsServer: IAppWsServer) {}

  listen() {
    this.wsServer.on('connection', (ws) => {
      const wsConnection = this.wsServer.createWsConnection(ws);

      ws.on('message', (data) => this.handleClientMessage(data, wsConnection));
    });
  }

  handleClientMessage(data: WebSocket.RawData, wsConnection: IWsConnection) {
    const message = parseWsMessageData(data);
    const action = message.type;

    try {
      switch (action) {
        default:
          handleError(new ServerError('Unsupported action'), wsConnection);
      }
    } catch (error) {
      handleError(error, wsConnection);
    }
  }
}
