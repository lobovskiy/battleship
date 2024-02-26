import { AttackResult, IGame, IShipData, IUser } from '../types';
import { IGameBoard } from './types';
import GameBoard from './models/GameBoard';
import { GameUserNotFoundError } from '../models/errors';
import getGridWithRandomShips from './utils/generateRandomShipsDataset';

export default class Game implements IGame {
  private gameBoardsByUserId: Record<string, IGameBoard> = {};

  public currentPlayerId: number;

  public winnerId: number | undefined;

  constructor(
    private player1: IUser,
    private player2: IUser
  ) {
    this.currentPlayerId = player1.id;
    this.gameBoardsByUserId[player1.id] = new GameBoard();
    this.gameBoardsByUserId[player2.id] = new GameBoard();
  }

  public getPlayers() {
    const { player1, player2 } = this;

    return { player1, player2 };
  }

  public getPlayerGameBoard(playerId: number) {
    this.validatePlayerId(playerId);

    return this.gameBoardsByUserId[String(playerId)];
  }

  public addShips(shipDataset: IShipData[], playerId: number) {
    const playerGameBoard = this.getPlayerGameBoard(playerId);
    const opponentGameBoard = this.getPlayerGameBoard(
      this.getOpponentIdByPlayerId(playerId)
    );

    playerGameBoard.addShips(shipDataset);

    return (
      !!playerGameBoard.shipDataset.length &&
      !!opponentGameBoard.shipDataset.length
    );
  }

  public addShipsToBot(botUserId: number) {
    const botGameBoard = this.getPlayerGameBoard(botUserId);
    const { ships } = getGridWithRandomShips();

    botGameBoard.addShips(ships);
  }

  public attack(x: number, y: number) {
    const defenderId = this.getOpponentIdByPlayerId(this.currentPlayerId);
    const defenderGameBoard = this.getPlayerGameBoard(defenderId);
    const attackResult = defenderGameBoard.attack(x, y);

    if (attackResult === AttackResult.Miss) {
      this.toggleCurrentPlayer();
    }

    return attackResult;
  }

  public getRandomAttackCoords() {
    const defenderId = this.getOpponentIdByPlayerId(this.currentPlayerId);
    const defenderGameBoard = this.getPlayerGameBoard(defenderId);

    return defenderGameBoard.getRandomAttackCoords();
  }

  public isGameOver() {
    for (const [playerId, gameBoard] of Object.entries(
      this.gameBoardsByUserId
    )) {
      if (gameBoard.isGameOver()) {
        this.setWinnerByLoserId(playerId);

        return true;
      }
    }

    return false;
  }

  private toggleCurrentPlayer() {
    if (this.currentPlayerId === this.player1.id) {
      this.currentPlayerId = this.player2.id;
    } else if (this.currentPlayerId === this.player2.id) {
      this.currentPlayerId = this.player1.id;
    }
  }

  private getOpponentIdByPlayerId(userId: number) {
    this.validatePlayerId(userId);

    if (this.player1.id === userId) {
      return this.player2.id;
    } else {
      return this.player1.id;
    }
  }

  private setWinnerByLoserId(loserId: number | string) {
    const winner =
      this.player1.id === Number(loserId) ? this.player2 : this.player1;

    winner.wins += 1;
    this.winnerId = winner.id;
  }

  private validatePlayerId(userId: number) {
    if (this.player1.id !== userId && this.player2.id !== userId) {
      throw new GameUserNotFoundError();
    }
  }
}
