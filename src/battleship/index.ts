import WebSocket from 'ws';
import { BattleshipError, ServerError } from './models/errors';
import { sendServerMessage } from './utils';
import { IWsApp, IWsConnection, WsMessage } from '../types';
import {
  ClientMessageDataByAction,
  IServerErrorData,
  IServerMessageData,
} from './types';

export class Battleship implements IWsApp {
  handleClientMessage(data: WebSocket.RawData, wsConnection: IWsConnection) {
    const message = this.parseWsMessageData(data);
    const action = message.type;

    try {
      switch (action) {
        default:
          this.handleError(new ServerError('Unsupported action'), wsConnection);
      }
    } catch (error) {
      this.handleError(error, wsConnection);
    }
  }

  private parseWsMessageData(
    data: WebSocket.RawData
  ): WsMessage<ClientMessageDataByAction> {
    const message = JSON.parse(
      data.toString()
    ) as WsMessage<ClientMessageDataByAction>;

    console.log('message received: ', message);

    return message;
  }

  private handleError(error: unknown, wsConnection: IWsConnection) {
    let payload: Omit<IServerMessageData, 'id'>;

    if (error instanceof BattleshipError) {
      const errorData = this.getErrorData(error.message);

      payload = {
        type: error.action,
        data: JSON.stringify(errorData),
      };
    } else {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal server error';
      const serverError = new ServerError(errorMessage);
      const errorData = this.getErrorData(serverError.message);

      payload = {
        type: serverError.action,
        data: JSON.stringify(errorData),
      };
    }

    sendServerMessage(payload, wsConnection);
  }

  private getErrorData(message?: string): IServerErrorData {
    return { error: true, errorText: message };
  }
}
