import { IWsMessage } from '../types';

export enum Actions {
  RegisterUser = 'reg',
  UpdateRooms = 'update_room',
  UpdateWinners = 'update_winners',
  ServerError = 'server_error',
}

export interface IClientUserData {
  name: string;
  password: string;
}

export type ClientMessageDataByAction = {
  [Actions.RegisterUser]: IClientUserData;
};

export interface IServerErrorData {
  error: boolean;
  errorText?: string;
}

export type MessagePayload = Omit<IWsMessage<Actions>, 'id'>;

export interface IUser {
  id: number;
  name: string;
  connectionId: string;
  wins: number;
}

export interface IRoom {
  id: number;
  users: IUser[];
}
