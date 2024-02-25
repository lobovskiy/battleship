import { IUser } from '../types';
import { IGameBoard } from './types';
import GameBoard from './models/GameBoard';

export default class Game {
  private gameBoardsByUserId: Record<number, IGameBoard> = {};

  constructor(
    private player1: IUser,
    private player2: IUser
  ) {
    this.gameBoardsByUserId[player1.id] = new GameBoard();
    this.gameBoardsByUserId[player2.id] = new GameBoard();
  }
}
