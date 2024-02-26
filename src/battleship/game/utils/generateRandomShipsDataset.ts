import { IShipData } from '../../types';

interface IGrid {
  size: number;
  ships: IShipData[];
}

function getRandomPosition(gridSize: number, ship: IShipData): IShipData {
  const randomX = Math.floor(Math.random() * gridSize);
  const randomY = Math.floor(Math.random() * gridSize);
  const randomDirection = Math.random() < 0.5; // true for horizontal, false for vertical

  // Ensure the ship fits within the grid
  const maxX = randomDirection ? gridSize - ship.length : gridSize;
  const maxY = randomDirection ? gridSize : gridSize - ship.length;
  const validX = Math.min(randomX, maxX);
  const validY = Math.min(randomY, maxY);

  return {
    position: {
      x: validX,
      y: validY,
    },
    direction: randomDirection,
    type: ship.type,
    length: ship.length,
  };
}

function placeShipsOnGrid(gridSize: number, ships: IShipData[]): IGrid {
  const grid: IGrid = {
    size: gridSize,
    ships: [],
  };

  for (const ship of ships) {
    let newShipPosition = getRandomPosition(gridSize, ship);
    // Ensure ships don't overlap or are too close to each other
    for (const existingShip of grid.ships) {
      while (
        overlap(newShipPosition, existingShip) ||
        tooClose(newShipPosition, existingShip)
      ) {
        newShipPosition = getRandomPosition(gridSize, ship);
      }
    }
    grid.ships.push(newShipPosition);
  }

  return grid;
}

function overlap(ship1: IShipData, ship2: IShipData): boolean {
  // Check if any part of ship1 overlaps with ship2
  if (ship1.direction === ship2.direction) {
    // Check horizontal overlap
    if (ship1.direction) {
      return (
        ship1.position.y === ship2.position.y &&
        Math.abs(ship1.position.x - ship2.position.x) < ship1.length
      );
    } else {
      // Check vertical overlap
      return (
        ship1.position.x === ship2.position.x &&
        Math.abs(ship1.position.y - ship2.position.y) < ship1.length
      );
    }
  }
  // Ships are perpendicular, so no overlap is possible
  return false;
}

function tooClose(ship1: IShipData, ship2: IShipData): boolean {
  // Check if ships are too close to each other (including diagonally)
  const minDistance = 2; // Minimum distance between any two ship cells
  for (
    let i = ship1.position.x - minDistance;
    i <= ship1.position.x + minDistance;
    i++
  ) {
    for (
      let j = ship1.position.y - minDistance;
      j <= ship1.position.y + minDistance;
      j++
    ) {
      if (
        Math.abs(ship2.position.x - i) <= 1 &&
        Math.abs(ship2.position.y - j) <= 1 &&
        !(i === ship1.position.x && j === ship1.position.y)
      ) {
        return true;
      }
    }
  }
  return false;
}

const ships: IShipData[] = [
  { position: { x: 0, y: 0 }, direction: false, type: 'huge', length: 4 },
  { position: { x: 0, y: 0 }, direction: false, type: 'large', length: 3 },
  { position: { x: 0, y: 0 }, direction: false, type: 'large', length: 3 },
  { position: { x: 0, y: 0 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 0, y: 0 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 0, y: 0 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 0, y: 0 }, direction: false, type: 'small', length: 1 },
  { position: { x: 0, y: 0 }, direction: false, type: 'small', length: 1 },
  { position: { x: 0, y: 0 }, direction: false, type: 'small', length: 1 },
  { position: { x: 0, y: 0 }, direction: false, type: 'small', length: 1 },
];

const gridSize = 10;
const getGridWithRandomShips = () => placeShipsOnGrid(gridSize, ships);

export default getGridWithRandomShips;
