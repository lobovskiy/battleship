export enum Actions {
  Register = 'reg',
  ServerError = 'server_error',
}

interface IClientUserData {
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
