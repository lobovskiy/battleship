import { AttackResult, IShipData } from '../types';

export enum Cell {
  Clear,
  Beaten,
}

export type ShipCoords = {
  x: number;
  y: number;
};

export interface IShip {
  position: ShipCoords[];
  attack: (x: number, y: number) => AttackResult;
}

export interface IGameBoard {
  shipDataset: IShipData[];
  addShips: (shipDataset: IShipData[]) => void;
  attack: (x: number, y: number) => AttackResult;
}
