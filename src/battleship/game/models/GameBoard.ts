import { Cell, IGameBoard, IShip, IShipData } from '../types';
import { createCellMatrix } from '../utils';
import Ship from './Ship';

export default class GameBoard implements IGameBoard {
  private field: Cell[][] = createCellMatrix(10, Cell.Clear);

  private shipDataset: IShipData[] = [];

  private ships: IShip[] = [];

  public addShips(shipDataset: IShipData[]) {
    this.shipDataset = shipDataset;
    shipDataset.forEach((shipData) => {
      this.ships.push(new Ship(shipData));
    });
  }

  public attack(x: number, y: number) {}
}
