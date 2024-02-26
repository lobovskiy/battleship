import Ship from './Ship';
import { createCellMatrix } from '../utils';
import { AttackResult, IGameFieldCoords, IShipData } from '../../types';
import { Cell, IGameBoard, IShip } from '../types';

export default class GameBoard implements IGameBoard {
  private field: Cell[][] = createCellMatrix(10, Cell.Clear);

  private ships: IShip[] = [];

  private shipsHit = 0;

  public shipDataset: IShipData[] = [];

  public addShips(shipDataset: IShipData[]) {
    this.shipDataset = shipDataset;
    shipDataset.forEach((shipData) => {
      this.ships.push(new Ship(shipData));
    });
  }

  public attack(x: number, y: number): AttackResult {
    if (this.field[x][y] !== Cell.Clear) {
      return AttackResult.Error;
    }

    let attackResult = AttackResult.Miss;

    for (const ship of this.ships) {
      const shipAttackResult = ship.attack(x, y);

      if (shipAttackResult !== AttackResult.Miss) {
        if (shipAttackResult === AttackResult.Killed) {
          this.shipsHit += 1;
        }

        attackResult = shipAttackResult;

        break;
      }
    }

    this.field[x][y] = Cell.Beaten;

    return attackResult;
  }

  public getRandomAttackCoords() {
    const coords: IGameFieldCoords[] = [];

    for (let y = 0; y < this.field.length; y++) {
      for (let x = 0; x < this.field.length; x++) {
        if (this.field[x][y] === Cell.Clear) {
          coords.push({ x, y });
        }
      }
    }

    if (!coords.length) {
      return null;
    }

    const randomCoordsIndex = Math.floor(Math.random() * (coords.length + 1));

    return coords[randomCoordsIndex];
  }
}
