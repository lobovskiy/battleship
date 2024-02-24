import WebSocket, { WebSocketServer } from 'ws';
import { IAppWsServer } from '../types';
import { WsConnection } from './models/ws_connection';

export class AppWsServer extends WebSocketServer implements IAppWsServer {
  constructor(port: number) {
    super({ port });
  }

  public createWsConnection(ws: WebSocket) {
    return new WsConnection(ws);
  }
}
