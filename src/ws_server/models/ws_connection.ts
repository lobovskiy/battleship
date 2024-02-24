import WebSocket, { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { IWsConnection } from '../../types';

export class WsConnection implements IWsConnection {
  public id: string = randomUUID();

  constructor(
    private ws: WebSocket,
    private server: WebSocketServer
  ) {}

  public send(data: string) {
    this.ws.send(data);
  }

  public broadcast(data: string) {
    this.server.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }
}
