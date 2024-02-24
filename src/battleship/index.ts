import WebSocket from 'ws';
import { ServerError } from './models/errors';
import { handleError, parseWsMessageData } from './utils';
import { IWsApp, IWsConnection } from '../types';

export class Battleship implements IWsApp {
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
