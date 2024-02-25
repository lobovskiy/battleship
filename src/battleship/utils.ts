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

  console.log('message received: ', message);

  return {
    ...message,
    data: JSON.parse(message.data),
  } as AppWsMessage<ClientMessageDataByAction>;
}

export function getServerMessageFromPayload(payload: MessagePayload) {
  const message: IWsMessage<Actions> = { ...payload, id: 0 };

  return JSON.stringify(message);
}

export function sendServerMessage(
  payload: MessagePayload,
  wsConnection: IWsConnection
) {
  const serverMessage = getServerMessageFromPayload(payload);

  wsConnection.send(serverMessage);
}

export function getErrorData(message?: string): IServerErrorData {
  return { error: true, errorText: message };
}

export function handleError(error: unknown, wsConnection: IWsConnection) {
  let payload: MessagePayload;

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
