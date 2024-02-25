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

export class UserNotFoundError extends BattleshipError {
  constructor() {
    super(Actions.ServerError, 'User not found');
  }
}

export class RoomNotFoundError extends BattleshipError {
  constructor() {
    super(Actions.ServerError, 'Room not found');
  }
}

export class RoomUserQtyError extends BattleshipError {
  constructor() {
    super(Actions.ServerError, 'Cannot add more than 2 users in a room');
  }
}

export class ServerError extends BattleshipError {
  constructor(message?: string) {
    super(Actions.ServerError, message);
  }
}
