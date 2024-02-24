import WebSocket from 'ws';
import { Actions } from './battleship/types';

export interface IWsConnection {
  id: string;
  send: (data: string) => void;
  broadcast: (data: string) => void;
}

export interface IWsApp {
  handleClientMessage: (
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
