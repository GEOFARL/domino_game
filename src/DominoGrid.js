import CellValue from './CellValue';
import Domino from './Domino';
import copyDominoGrid, { copyDomino } from './copyFunc';

export default class DominoGrid {
  constructor(size, initialBoard = null) {
    this.size = size;
    this.cellValues = [];
    if (initialBoard) {
      this.board = initialBoard;
      this.board.forEach((row) => {
        row.forEach((value) => {
          if (value instanceof CellValue) {
            value.dominoGrid = this;
            this.cellValues.push(value);
          }
        });
      });
    } else {
      this.generateBoard();
    }

    this.availableDominos = DominoGrid.generateDominoes();
    this.shuffleDominoes();
  }

  generateBoard() {
    const INTENSITY = 80 + Math.floor(Math.random() * 11);

    this.board = Array(this.size)
      .fill(0)
      .map(() => Array(this.size).fill(0));

    let tempGrid = new DominoGrid(
      this.size,
      Array(this.size)
        .fill(0)
        .map(() => Array(this.size).fill(0))
    );

    [tempGrid] = tempGrid.findAllSolutions();
    const solvedBoard = tempGrid.board;

    for (let r = 0; r < this.size; r += 1) {
      for (let c = 0; c < this.size; c += 1) {
        if (
          !(solvedBoard[r][c] instanceof Domino) &&
          Math.random() < INTENSITY / 100
        ) {
          const value = tempGrid.findAdjSum(new CellValue(1, r, c));
          if (value > 0) {
            const newCellValue = new CellValue(value, r, c);
            this.cellValues.push(newCellValue);
            this.board[r][c] = newCellValue;
          }
        }
      }
    }
  }

  static generateDominoes() {
    const dominos = [];
    for (let i = 1; i < 6; i += 1) {
      for (let j = i + 1; j <= 6; j += 1) {
        dominos.push(new Domino(i, j));
      }
    }
    return dominos;
  }

  static offsets = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  shuffleDominoes() {
    for (let i = this.availableDominos.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.availableDominos[i], this.availableDominos[j]] = [
        this.availableDominos[j],
        this.availableDominos[i],
      ];
    }
  }

  placeDomino(domino) {
    const r1 = domino.tipRow;
    const c1 = domino.tipCol;

    const [offR, offC] = DominoGrid.offsets[domino.direction];
    const r2 = r1 + offR;
    const c2 = c1 + offC;

    this.board[r1][c1] = domino;
    this.board[r2][c2] = domino;
  }

  unPlaceDomino(domino) {
    const r1 = domino.tipRow;
    const c1 = domino.tipCol;

    const [offR, offC] = DominoGrid.offsets[domino.direction];
    const r2 = r1 + offR;
    const c2 = c1 + offC;

    this.board[r1][c1] = 0;
    this.board[r2][c2] = 0;
  }

  isSameInRow(value, row, placedCol) {
    for (let col = 0; col < this.size; col += 1) {
      if (col === placedCol) continue;
      if (this.isOnBoard(row, col) && this.board[row][col] instanceof Domino) {
        if (this.board[row][col].getValue(row, col) === value) {
          return true;
        }
      }
    }
    return false;
  }

  isSameInCol(value, col, placedRow) {
    for (let row = 0; row < this.size; row += 1) {
      if (row === placedRow) continue;
      if (this.isOnBoard(row, col) && this.board[row][col] instanceof Domino) {
        if (this.board[row][col].getValue(row, col) === value) {
          return true;
        }
      }
    }
    return false;
  }

  isOnBoard(row, col) {
    const rows = this.board.length;
    const cols = this.board[0].length;
    return row >= 0 && row < rows && col >= 0 && col < cols;
  }

  isPositionFree(row, col) {
    if (!this.isOnBoard(row, col)) {
      return false;
    }
    return this.board[row][col] === 0;
  }

  findDirections(row, col) {
    const directions = [];
    if (this.isPositionFree(row - 1, col)) {
      // North
      directions.push(0);
    }

    // East
    if (this.isPositionFree(row, col + 1)) {
      directions.push(1);
    }

    // South
    if (this.isPositionFree(row + 1, col)) {
      directions.push(2);
    }

    // West
    if (this.isPositionFree(row, col - 1)) {
      directions.push(3);
    }

    return directions;
  }

  findAvailablePosition() {
    const undoneCell = this.cellValues.find((cell) => !cell.done);

    if (this.cellValues.length !== 0 && undoneCell) {
      const cellValue = undoneCell;
      const emptyCells = this.findEmptyAdjCells(cellValue);
      for (const [r, c] of emptyCells) {
        const directions = this.findDirections(r, c);
        if (directions.length !== 0) {
          return [[r, c], directions];
        }
      }
      return null;
    }

    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (this.isPositionFree(i, j)) {
          const directions = this.findDirections(i, j);
          if (directions.length !== 0) {
            return [[i, j], directions];
          }
        }
      }
    }
    return null;
  }

  isAdjDomino(pos, direction) {
    const [r1, c1] = pos;
    const [rOff, cOff] = DominoGrid.offsets[direction];
    const r2 = r1 + rOff;
    const c2 = c1 + cOff;

    const rowStart = Math.min(r1, r2) - 1;
    const colStart = Math.min(c1, c2) - 1;

    const rowEnd = rowStart + 2 + Math.abs(r1 - r2);
    const colEnd = colStart + 2 + Math.abs(c1 - c2);

    for (let row = rowStart; row <= rowEnd; row += 1) {
      for (let col = colStart; col <= colEnd; col += 1) {
        if (this.isOnBoard(row, col)) {
          if (!((row === r1 && col === c1) || (row === r2 && col === c2))) {
            if (this.board[row][col] instanceof Domino) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  removeDomino(dominoToRemove) {
    this.availableDominos = this.availableDominos.filter(
      (domino) => !Domino.areTheSame(domino, dominoToRemove)
    );
  }

  returnInitialDomino(initialDomino, place) {
    this.availableDominos.splice(place, 0, initialDomino);
  }

  markFinishedCells() {
    const finishedCells = [];
    this.cellValues.forEach((value) => {
      if (!value.done) {
        if (this.isSolved(value)) {
          value.done = true;
          // this.markCells(value);
          finishedCells.push(value);
        }
      }
    });
    return finishedCells;
  }

  static unMarkFinishedCells(finishedCells) {
    finishedCells.forEach((cell) => {
      // this.unMarkCells(cell);
      cell.done = false;
    });
  }

  findUnFinishedCells() {
    const unfinishedCells = [];
    this.cellValues.forEach((value) => {
      if (!value.done) {
        unfinishedCells.push(value);
      }
    });
    return unfinishedCells;
  }

  findEmptyAdjCells(cell) {
    const startRow = cell.row - 1;
    const startCol = cell.col - 1;

    const emptyCells = [];

    for (let r = startRow; r < startRow + 3; r += 1) {
      for (let c = startCol; c < startCol + 3; c += 1) {
        if (this.isPositionFree(r, c)) {
          emptyCells.push([r, c]);
        }
      }
    }

    return emptyCells;
  }

  findAdjSum(cell) {
    const startRow = cell.row - 1;
    const startCol = cell.col - 1;

    let sum = 0;

    for (let r = startRow; r < startRow + 3; r += 1) {
      for (let c = startCol; c < startCol + 3; c += 1) {
        if (
          this.isOnBoard(r, c) &&
          !(r === cell.row && c === cell.col) &&
          !(this.board[r][c] instanceof CellValue)
        ) {
          if (this.board[r][c] instanceof Domino) {
            sum += this.board[r][c].getValue(r, c);
          }
        }
      }
    }

    return sum;
  }

  checkValidity(cell) {
    const sum = this.findAdjSum(cell);

    const possibleMoves = this.findEmptyAdjCells(cell).filter((pos) => {
      const [r, c] = pos;
      const direction = this.findDirections(r, c);
      return direction.length > 0;
    });

    return sum === cell.value || (sum < cell.value && possibleMoves.length > 0);
  }

  isSolved(cell) {
    const sum = this.findAdjSum(cell);
    return sum === cell.value;
  }

  validate(pos, direction, domino) {
    const [r1, c1] = pos;
    const [rOff, cOff] = DominoGrid.offsets[direction];
    const r2 = r1 + rOff;
    const c2 = c1 + cOff;

    if (!this.isOnBoard(r2, c2)) {
      return false;
    }
    if (this.isSameInRow(domino.a, r1) || this.isSameInCol(domino.a, c1)) {
      return false;
    }
    if (this.isSameInRow(domino.b, r2) || this.isSameInCol(domino.b, c2)) {
      return false;
    }
    if (this.isAdjDomino([r1, c1], direction)) {
      return false;
    }

    return true;
  }

  validateSolution() {
    let isValid = true;
    isValid = this.cellValues.every((cellValue) =>
      this.checkValidity(cellValue)
    );
    if (!isValid) {
      return false;
    }
    console.log('cells are valid');

    for (let r = 0; r < this.size; r += 1) {
      for (let c = 0; c < this.size; c += 1) {
        if (this.board[r][c] instanceof Domino) {
          const domino = this.board[r][c];
          if (
            this.isSameInRow(domino.getValue(r, c), r, c) ||
            this.isSameInCol(domino.getValue(r, c), c, r)
          ) {
            console.log(this);
            console.log(domino);
            console.log('1', r, c);
            return false;
          }
          if (r === domino.tipRow && c === domino.tipCol) {
            if (this.isAdjDomino([r, c], domino.direction)) {
              console.log('2', r, c);
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  findAllSolutions() {
    const result = [];
    const TIME_OUT = 60;
    const TIME_OUT_LIMIT = 3;
    let timeOutCount = 0;
    let startingTime = Date.now();
    const initialBoard = copyDominoGrid(this);

    const solve = (dominoGrid) => {
      const currentTime = Date.now();
      console.log(`Time passed: ${currentTime - startingTime}`);
      if (currentTime - startingTime > TIME_OUT * 1000) {
        timeOutCount += 1;
        console.error(`Timeout #${timeOutCount + 1}`);
        throw new Error('Timeout');
      }
      const val = dominoGrid.findAvailablePosition();
      let currPos;
      let directions;
      if (val) {
        [currPos, directions] = val;
      } else {
        return false;
      }

      while (currPos) {
        console.log(
          `Current position: ${currPos}, Current Directions: ${directions}`
        );
        for (let i = 0; i < dominoGrid.availableDominos.length; i += 1) {
          const currInitialDomino = copyDomino(dominoGrid.availableDominos[i]);
          const currDomino = dominoGrid.availableDominos[i];
          console.log(`in for loop, i: ${i}`);

          for (const direction of directions) {
            const isValid = dominoGrid.validate(currPos, direction, currDomino);

            if (isValid) {
              Domino.setupDomino(currDomino, currPos, direction);
              dominoGrid.placeDomino(currDomino);
              dominoGrid.removeDomino(currDomino);
              const unFinishedCells = dominoGrid.findUnFinishedCells();
              let finishedCells;

              if (unFinishedCells && unFinishedCells.length > 0) {
                finishedCells = dominoGrid.markFinishedCells();
                const cellValue = dominoGrid.cellValues.find(
                  (cell) => !cell.done
                );

                if (dominoGrid.availableDominos.length === 0 && !cellValue) {
                  console.log('finished');
                  result.push(dominoGrid);
                  console.log(dominoGrid);
                  return true;
                }

                if (cellValue && !dominoGrid.checkValidity(cellValue)) {
                  if (finishedCells && finishedCells.length > 0) {
                    DominoGrid.unMarkFinishedCells(finishedCells);
                  }
                  dominoGrid.returnInitialDomino(currInitialDomino, i);
                  dominoGrid.unPlaceDomino(currDomino);
                  console.log('continue');
                  continue;
                }
              } else if (dominoGrid.availableDominos.length === 0) {
                result.push(dominoGrid);
                console.log('finished');
                console.log(dominoGrid);
                return true;
              }
              console.log('recursive call');
              if (solve(copyDominoGrid(dominoGrid))) {
                return true;
              }
              if (finishedCells && finishedCells.length > 0) {
                DominoGrid.unMarkFinishedCells(finishedCells);
              }
              dominoGrid.returnInitialDomino(currInitialDomino, i);
              dominoGrid.unPlaceDomino(currDomino);
            }
          }

          Domino.rotateDomino(currDomino);

          for (const direction of directions) {
            const isValid = dominoGrid.validate(currPos, direction, currDomino);

            if (isValid) {
              Domino.setupDomino(currDomino, currPos, direction);
              dominoGrid.placeDomino(currDomino);
              dominoGrid.removeDomino(currDomino);
              const unFinishedCells = dominoGrid.findUnFinishedCells();
              let finishedCells;

              if (unFinishedCells && unFinishedCells.length > 0) {
                finishedCells = dominoGrid.markFinishedCells();
                const cellValue = dominoGrid.cellValues.find(
                  (cell) => !cell.done
                );

                if (dominoGrid.availableDominos.length === 0 && !cellValue) {
                  console.log('finished');
                  result.push(dominoGrid);
                  console.log(dominoGrid);
                  return true;
                }

                if (cellValue && !dominoGrid.checkValidity(cellValue)) {
                  if (finishedCells && finishedCells.length > 0) {
                    DominoGrid.unMarkFinishedCells(finishedCells);
                  }
                  dominoGrid.returnInitialDomino(currInitialDomino, i);
                  dominoGrid.unPlaceDomino(currDomino);
                  console.log('continue');
                  continue;
                }
              } else if (dominoGrid.availableDominos.length === 0) {
                result.push(dominoGrid);
                console.log('finished');
                console.log(dominoGrid);
                return true;
              }
              console.log('recursive call');
              if (solve(copyDominoGrid(dominoGrid))) {
                return true;
              }
              if (finishedCells && finishedCells.length > 0) {
                DominoGrid.unMarkFinishedCells(finishedCells);
              }
              dominoGrid.returnInitialDomino(currInitialDomino, i);
              dominoGrid.unPlaceDomino(currDomino);
            }
          }
        }
        const [r, c] = currPos;
        dominoGrid.board[r][c] = false;
        const a = dominoGrid.findAvailablePosition();
        if (a) {
          [currPos, directions] = a;
        } else {
          currPos = null;
        }
      }
      return false;
    };

    while (result.length === 0) {
      try {
        console.warn(this.availableDominos);
        if (!solve(copyDominoGrid(this))) {
          return [];
        }
      } catch (err) {
        const startingBoard = copyDominoGrid(initialBoard);
        this.board = startingBoard.board;
        this.cellValues = startingBoard.cellValues;
        this.availableDominos = startingBoard.availableDominos;
        this.shuffleDominoes();
        startingTime = Date.now();
        if (timeOutCount === TIME_OUT_LIMIT) {
          return [];
        }
      }
    }

    return result;
  }
}
