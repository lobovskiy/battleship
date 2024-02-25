import { Cell } from './types';

export function createCellMatrix(size: number, cell: Cell): Cell[][] {
  const columns = [...Array(size).keys()];

  return columns.map((_) => Array(size).fill(cell));
}
