import WebSocket from 'ws';
import { BattleshipError, ServerError } from './models/errors';
import { IWsConnection, AppWsMessage, IWsMessage } from '../types';
import {
  Actions,
  ClientMessageDataByAction,
  IServerErrorData,
  IServerMessageData,
} from './types';

export function parseWsMessageData(
  data: WebSocket.RawData
): AppWsMessage<ClientMessageDataByAction> {
  const message = JSON.parse(data.toString()) as IWsMessage<Actions>;

  console.log('message received: ', message);

  return {
    ...message,
    data: JSON.parse(message.data),
  } as AppWsMessage<ClientMessageDataByAction>;
}

export function getServerMessageFromPayload(
  payload: Omit<IServerMessageData, 'id'>
) {
  const messageData: IServerMessageData = { ...payload, id: 0 };

  return JSON.stringify(messageData);
}

export function sendServerMessage(
  payload: Omit<IServerMessageData, 'id'>,
  wsConnection: IWsConnection
) {
  const serverMessage = getServerMessageFromPayload(payload);

  wsConnection.send(serverMessage);
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
