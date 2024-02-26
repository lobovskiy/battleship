import WebSocket, { WebSocketServer } from 'ws';
import { IAppWsServer } from '../types';
import { WsConnection } from './models/WsConnection';

export class AppWsServer extends WebSocketServer implements IAppWsServer {
  private wsConnections: WsConnection[] = [];

  constructor(port: number) {
    super({ port });
  }

  public createWsConnection(ws: WebSocket) {
    const wsConnection = new WsConnection(ws);

    this.wsConnections.push(wsConnection);

    return wsConnection;
  }

  public findWsConnectionById(id: string) {
    return this.wsConnections.find((wsConnection) => wsConnection.id === id);
  }

  public removeConnection(id: string) {
    this.wsConnections = this.wsConnections.filter(
      (wsConnection) => wsConnection.id !== id
    );
  }
}
