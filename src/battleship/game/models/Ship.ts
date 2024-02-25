import { IShipData } from '../../types';
import { AttackResult, IShip, ShipCoords } from '../types';

export default class Ship implements IShip {
  position: ShipCoords[] = [];

  hits: number = 0;

  constructor(shipData: IShipData) {
    const { position, direction, length } = shipData;
    const { x, y } = position;
    const lengthIndexes = [...Array(length).keys()];

    if (direction) {
      lengthIndexes.forEach((index) => {
        this.position.push({ x, y: y + index });
      });
    } else {
      lengthIndexes.forEach((index) => {
        this.position.push({ x: x + index, y });
      });
    }
  }

  public attack(x: number, y: number): AttackResult {
    let result: AttackResult = AttackResult.Miss;

    for (const coords of this.position) {
      if (coords.x === x && coords.y === y) {
        this.hits += 1;
        result =
          this.hits === this.position.length
            ? AttackResult.Killed
            : AttackResult.Shot;

        break;
      }
    }

    return result;
  }
}
