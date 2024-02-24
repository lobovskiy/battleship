import WebSocket from 'ws';
import { BattleshipError, ServerError } from './models/errors';
import { IWsConnection, WsMessage } from '../types';
import {
  ClientMessageDataByAction,
  IServerErrorData,
  IServerMessageData,
} from './types';

export function parseWsMessageData(
  data: WebSocket.RawData
): WsMessage<ClientMessageDataByAction> {
  const message = JSON.parse(
    data.toString()
  ) as WsMessage<ClientMessageDataByAction>;

  console.log('message received: ', message);

  return message;
}

export function sendServerMessage(
  payload: Omit<IServerMessageData, 'id'>,
  wsConnection: IWsConnection,
  broadcast?: boolean
) {
  const messageData: IServerMessageData = { ...payload, id: 0 };
  const serverMessage = JSON.stringify(messageData);

  broadcast
    ? wsConnection.broadcast(serverMessage)
    : wsConnection.send(serverMessage);
}

export function getErrorData(message?: string): IServerErrorData {
  return { error: true, errorText: message };
}

export function handleError(error: unknown, wsConnection: IWsConnection) {
  let payload: Omit<IServerMessageData, 'id'>;

  if (error instanceof BattleshipError) {
    const errorData = getErrorData(error.message);

    payload = {
      type: error.action,
      data: JSON.stringify(errorData),
    };
  } else {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    const serverError = new ServerError(errorMessage);
    const errorData = getErrorData(serverError.message);

    payload = {
      type: serverError.action,
      data: JSON.stringify(errorData),
    };
  }

  sendServerMessage(payload, wsConnection);
}
