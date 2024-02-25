import WebSocket from 'ws';
import { BattleshipError, ServerError } from './models/errors';
import { IWsConnection, AppWsMessage, IWsMessage } from '../types';
import {
  Actions,
  ClientMessageDataByAction,
  IServerErrorData,
  MessagePayload,
} from './types';

export function parseWsMessageData(
  data: WebSocket.RawData
): AppWsMessage<ClientMessageDataByAction> {
  const message = JSON.parse(data.toString()) as IWsMessage<Actions>;
  const messageData = message.data.length ? JSON.parse(message.data) : null;

  console.log('message received:');
  console.log('action: ', message.type);
  console.log('data:', messageData);

  return {
    ...message,
    data: messageData,
  } as AppWsMessage<ClientMessageDataByAction>;
}

export function createMessagePayload(
  type: Actions,
  data: object
): MessagePayload {
  return { type, data: JSON.stringify(data) };
}

export function createServerMessage(payload: MessagePayload) {
  const message: IWsMessage<Actions> = { ...payload, id: 0 };

  return JSON.stringify(message);
}

export function sendServerMessage(
  payload: MessagePayload,
  wsConnection: IWsConnection
) {
  const serverMessage = createServerMessage(payload);

  wsConnection.send(serverMessage);
}

export function getErrorData(message?: string): IServerErrorData {
  return { error: true, errorText: message };
}

export function handleError(error: unknown, wsConnection: IWsConnection) {
  let payload: MessagePayload;

  if (error instanceof BattleshipError) {
    const errorData = getErrorData(error.message);

    payload = createMessagePayload(error.action, errorData);
  } else {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    const serverError = new ServerError(errorMessage);
    const errorData = getErrorData(serverError.message);

    payload = createMessagePayload(serverError.action, errorData);
  }

  sendServerMessage(payload, wsConnection);
}
