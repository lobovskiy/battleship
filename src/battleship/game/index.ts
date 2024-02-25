import { IGame, IShipData, IUser } from '../types';
import { IGameBoard } from './types';
import GameBoard from './models/GameBoard';
import { GameUserNotFoundError } from '../models/errors';

export default class Game implements IGame {
  private gameBoardsByUserId: Record<string, IGameBoard> = {};

  constructor(
    private player1: IUser,
    private player2: IUser
  ) {
    this.gameBoardsByUserId[player1.id] = new GameBoard();
    this.gameBoardsByUserId[player2.id] = new GameBoard();
  }

  public addShips(shipDataset: IShipData[], userId: number) {
    const userGameBoard = this.getGameBoardByUserId(userId);
    const opponentGameBoard = this.getGameBoardByUserId(
      this.getOpponentIdByUserId(userId)
    );

    userGameBoard.addShips(shipDataset);

    return (
      !!userGameBoard.shipDataset.length &&
      !!opponentGameBoard.shipDataset.length
    );
  }

  private getGameBoardByUserId(userId: number) {
    this.validateUserId(userId);

    return this.gameBoardsByUserId[String(userId)];
  }

  private getOpponentIdByUserId(userId: number) {
    this.validateUserId(userId);

    if (this.player1.id === userId) {
      return this.player2.id;
    } else {
      return this.player1.id;
    }
  }

  private validateUserId(userId: number) {
    if (this.player1.id !== userId && this.player2.id !== userId) {
      throw new GameUserNotFoundError();
    }
  }
}
