import Domino from './Domino';

export default class CellValue {
  constructor(value, row, col, dominoGrid) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.dominoGrid = dominoGrid;
    this.done = false;
  }

  findEmptyAdjCells() {
    const startRow = this.row - 1;
    const startCol = this.col - 1;

    const emptyCells = [];

    for (let r = startRow; r < startRow + 3; r += 1) {
      for (let c = startCol; c < startCol + 3; c += 1) {
        if (this.dominoGrid.isPositionFree(r, c, this.dominoGrid.board)) {
          emptyCells.push([r, c]);
        }
      }
    }

    return emptyCells;
  }

  findAdjSum() {
    const startRow = this.row - 1;
    const startCol = this.col - 1;

    let sum = 0;

    for (let r = startRow; r < startRow + 3; r += 1) {
      for (let c = startCol; c < startCol + 3; c += 1) {
        if (
          this.dominoGrid.isOnBoard(r, c, this.dominoGrid.board) &&
          !(r === this.row && c === this.col) &&
          !(this.dominoGrid.board[r][c] instanceof CellValue)
        ) {
          if (this.dominoGrid.board[r][c] instanceof Domino) {
            sum += this.dominoGrid.board[r][c].getValue(r, c);
          }
        }
      }
    }

    return sum;
  }

  checkValidity() {
    const sum = this.findAdjSum();

    const possibleMoves = this.findEmptyAdjCells().filter((pos) => {
      const [r, c] = pos;
      const direction = this.dominoGrid.findDirections(r, c);
      return direction.length > 0;
    });

    return sum <= this.value && possibleMoves.length > 0;
  }

  isSolved() {
    const sum = this.findAdjSum();
    return sum === this.value;
  }

  markCells() {
    const startRow = this.row - 1;
    const startCol = this.col - 1;

    for (let r = startRow; r < startRow + 3; r += 1) {
      for (let c = startCol; c < startCol + 3; c += 1) {
        if (this.dominoGrid.isPositionFree(r, c, this.dominoGrid.board)) {
          this.dominoGrid.board[r][c] = false;
        }
      }
    }
  }
}
