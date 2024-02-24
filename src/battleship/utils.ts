import { IWsConnection } from '../types';
import { IServerMessageData } from './types';

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
