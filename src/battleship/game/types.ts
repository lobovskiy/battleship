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

export interface IShipData {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: 'small' | 'medium' | 'large' | 'huge';
  length: number;
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
  addShips: (shipDataset: IShipData[]) => void;
  attack: (x: number, y: number) => void;
}
