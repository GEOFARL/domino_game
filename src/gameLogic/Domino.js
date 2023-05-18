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

  static setupDomino(domino, pos, direction) {
    const [r, c] = pos;
    domino.direction = direction;
    domino.tipRow = r;
    domino.tipCol = c;
  }

  static areTheSame(domino1, domino2) {
    return (
      (domino1.a === domino2.a && domino1.b === domino2.b) ||
      (domino1.a === domino2.b && domino1.b === domino2.a)
    );
  }

  static rotateDomino(domino) {
    domino.rotated = !domino.rotated;
    [domino.a, domino.b] = [domino.b, domino.a];
  }
}
