import WebSocket from 'ws';
import { randomUUID } from 'crypto';
import { IWsConnection } from '../../types';

export class WsConnection implements IWsConnection {
  public id: string = randomUUID();

  constructor(private ws: WebSocket) {}

  public send(data: string) {
    this.ws.send(data);
  }
}
