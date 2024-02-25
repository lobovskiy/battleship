import { IWsMessage } from '../types';

export enum Actions {
  RegisterUser = 'reg',
  UpdateRooms = 'update_room',
  UpdateWinners = 'update_winners',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  CreateGame = 'create_game',
  AddShips = 'add_ships',
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

export interface IShipData {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: 'small' | 'medium' | 'large' | 'huge';
  length: number;
}

export interface IClientShipDataset {
  gameId: number;
  ships: IShipData[];
}

export type ClientMessageDataByAction = {
  [Actions.RegisterUser]: IClientUserData;
  [Actions.CreateRoom]: null;
  [Actions.AddUserToRoom]: IClientRoomData;
  [Actions.AddShips]: IClientShipDataset;
};

export interface IServerErrorData {
  error: boolean;
  errorText?: string;
}

export interface IServerUserData {
  name: string;
  index: TIndex;
}

export interface IServerGameData {
  idGame: TIndex;
  idPlayer: TIndex;
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
  initGame: () => void;
  addUserShips: (shipDataset: IShipData[], userId: number) => boolean;
}

export interface IGame {
  addShips: (shipDataset: IShipData[], userId: number) => boolean;
}
