import WebSocket, { WebSocketServer } from 'ws';

export interface IWsConnection {
  id: string;
  send: (data: string) => void;
}

export interface IAppWsServer extends WebSocketServer {
  createWsConnection: (ws: WebSocket) => IWsConnection;
  findWsConnectionById: (id: string) => IWsConnection | undefined;
  removeConnection: (id: string) => void;
}

export interface IWsApp {
  listen: () => void;
  handleClientMessage: (
    data: WebSocket.RawData,
    wsConnection: IWsConnection
  ) => void;
}

export interface IWsMessage<T> {
  id: number;
  type: T;
  data: string;
}

export type AppWsMessage<T> = {
  [K in keyof T]: {
    id: number;
    type: K;
    data: T[K];
  };
}[keyof T];
