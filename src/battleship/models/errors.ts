import { Actions } from '../types';

export class BattleshipError extends Error {
  constructor(
    public readonly action: Actions,
    message?: string
  ) {
    super(message);
    this.name = 'Battleship Error';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServerError extends BattleshipError {
  constructor(message?: string) {
    super(Actions.ServerError, message);
  }
}
