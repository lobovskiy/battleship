import { IShipData } from '../types';

export enum Cell {
  Clear,
  Beaten,
}

export enum AttackResult {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
  Error = 'error',
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
  attack: (x: number, y: number) => void;
}
