import { WebSocketServer } from 'ws';
import { IWsApp } from '../types';
import { WsConnection } from './models/ws_connection';

export class WsServer {
  private server: WebSocketServer;

  constructor(port: number) {
    this.server = new WebSocketServer({ port });
  }

  public setConnectionHandlerApp(app: IWsApp) {
    this.server.on('connection', (ws) => {
      const wsConnection = new WsConnection(ws, this.server);

      ws.on('message', (data) => app.handleWsMessage(data, wsConnection));
    });
  }
}
