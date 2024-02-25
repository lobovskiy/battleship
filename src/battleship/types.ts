import { IWsMessage } from '../types';

export enum Actions {
  RegisterUser = 'reg',
  UpdateRooms = 'update_room',
  UpdateWinners = 'update_winners',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  ServerError = 'server_error',
}

export type TIndex = number;

export interface IClientUserData {
  name: string;
  password: string;
}

export interface IClientRoomData {
  indexRoom: TIndex;
}

export type ClientMessageDataByAction = {
  [Actions.RegisterUser]: IClientUserData;
  [Actions.CreateRoom]: null;
  [Actions.AddUserToRoom]: IClientRoomData;
};

export interface IServerErrorData {
  error: boolean;
  errorText?: string;
}

export interface IServerUserData {
  name: string;
  index: number;
}

export type MessagePayload = Omit<IWsMessage<Actions>, 'id'>;

export interface IUser {
  id: TIndex;
  name: string;
  password: string;
  connectionId: string;
  wins: number;
}

export interface IRoom {
  id: TIndex;
  getUsers: () => IServerUserData[];
  addUser: (user: IUser) => IServerUserData[];
}
