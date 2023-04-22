export default class Domino {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    // 0 - north
    // 1 - east
    // 2 - south
    // 3 - west
    this.direction = Math.round(Math.random() * 3);
    this.tipRow = null;
    this.tipCol = null;
    this.rotated = false;
  }

  getValue(row, col) {
    if (row === this.tipRow && col === this.tipCol) {
      return this.a;
    }
    return this.b;
  }
}
