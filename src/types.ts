import WebSocket from 'ws';

export interface IWsConnection {
  id: string;
}

export interface IWsApp {
  handleWsMessage: (
    data: WebSocket.RawData,
    wsConnection: IWsConnection
  ) => void;
}

export type WsMessage<T> = {
  [K in keyof T]: {
    id: number;
    type: K;
    data: T[K];
  };
}[keyof T];
