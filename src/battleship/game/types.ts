import { AttackResult, IGameFieldCoords, IShipData } from '../types';

export enum Cell {
  Clear,
  Beaten,
}

export interface IShip {
  position: IGameFieldCoords[];
  attack: (x: number, y: number) => AttackResult;
}

export interface IGameBoard {
  shipDataset: IShipData[];
  addShips: (shipDataset: IShipData[]) => void;
  attack: (x: number, y: number) => AttackResult;
  getRandomAttackCoords: () => IGameFieldCoords | null;
}
