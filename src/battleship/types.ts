export enum Actions {
  Register = 'reg',
  UpdateRoom = 'update_room',
  UpdateWinners = 'update_winners',
  ServerError = 'server_error',
}

export interface IClientUserData {
  name: string;
  password: string;
}

export type ClientMessageDataByAction = {
  [Actions.Register]: IClientUserData;
};

export interface IServerErrorData {
  error: boolean;
  errorText?: string;
}

export interface IServerMessageData {
  id: number;
  type: Actions;
  data: string;
}
