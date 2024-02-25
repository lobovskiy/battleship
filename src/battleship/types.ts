import { IWsMessage } from '../types';
import { IGameBoard } from './game/types';

export enum Actions {
  RegisterUser = 'reg',
  UpdateRooms = 'update_room',
  UpdateWinners = 'update_winners',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  CreateGame = 'create_game',
  AddShips = 'add_ships',
  StartGame = 'start_game',
  Attack = 'attack',
  Turn = 'turn',
  ServerError = 'server_error',
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

export enum AttackResult {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
  Error = 'error',
}

export type TIndex = number;

export interface IClientUserData {
  name: string;
  password: string;
}

export interface IClientRoomData {
  indexRoom: TIndex;
}

export interface IClientShipDataset {
  gameId: number;
  ships: IShipData[];
}

export interface IClientAttackData {
  gameId: TIndex;
  indexPlayer: TIndex;
  x: number;
  y: number;
}

export type ClientMessageDataByAction = {
  [Actions.RegisterUser]: IClientUserData;
  [Actions.CreateRoom]: null;
  [Actions.AddUserToRoom]: IClientRoomData;
  [Actions.AddShips]: IClientShipDataset;
  [Actions.Attack]: IClientAttackData;
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

export interface IServerUserShipsDataset {
  ships: IShipData[];
  currentPlayerIndex: TIndex;
}

export interface IServerAttackResultData {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: TIndex;
  status: AttackResult;
}

export interface IServerTurnData {
  currentPlayer: TIndex;
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
  game: IGame | undefined;
  getUsers: () => IServerUserData[];
  addUser: (user: IUser) => IServerUserData[];
  initGame: () => void;
  addUserShips: (shipDataset: IShipData[], userId: number) => boolean;
}

export interface IGame {
  currentPlayerId: TIndex;
  getPlayers: () => { player1: IUser; player2: IUser };
  getPlayerGameBoard: (playerId: number) => IGameBoard;
  addShips: (shipDataset: IShipData[], userId: number) => boolean;
  attack: (attackerId: number, x: number, y: number) => AttackResult;
}
