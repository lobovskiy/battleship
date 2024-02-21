import { IWsApp, IWsConnection, WsMessage } from '../types';
import WebSocket from 'ws';
import { MessageDataByAction } from './types';

export class Battleship implements IWsApp {
  handleWsMessage(data: WebSocket.RawData, wsConnection: IWsConnection) {
    const message = this.parseWsMessageData(data);
    const action = message.type;
  }

  private parseWsMessageData(
    data: WebSocket.RawData
  ): WsMessage<MessageDataByAction> {
    const message = JSON.parse(
      data.toString()
    ) as WsMessage<MessageDataByAction>;

    console.log('message received: ', message);

    return message;
  }
}
