import Ship from './Ship';
import { createCellMatrix } from '../utils';
import { IShipData } from '../../types';
import { Cell, IGameBoard, IShip } from '../types';

export default class GameBoard implements IGameBoard {
  private field: Cell[][] = createCellMatrix(10, Cell.Clear);

  private ships: IShip[] = [];

  public shipDataset: IShipData[] = [];

  public addShips(shipDataset: IShipData[]) {
    this.shipDataset = shipDataset;
    shipDataset.forEach((shipData) => {
      this.ships.push(new Ship(shipData));
    });
  }

  public attack(x: number, y: number) {}
}
