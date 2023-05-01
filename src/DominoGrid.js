import CellValue from './CellValue';
import Domino from './Domino';
import copyDominoGrid, { copyDomino } from './copyFunc';

export default class DominoGrid {
  constructor(size, initialBoard = null) {
    this.size = size;
    if (initialBoard) {
      this.board = initialBoard;

      this.cellValues = [];
      this.board.forEach((row) => {
        row.forEach((value) => {
          if (value instanceof CellValue) {
            value.dominoGrid = this;
            this.cellValues.push(value);
          }
        });
      });
    } else {
      // Generate random board
    }

    this.availableDominos = DominoGrid.generateDominoes();
    this.shuffleDominoes();
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

  isSameInRow(value, row) {
    for (let col = 0; col < this.size; col += 1) {
      if (this.isOnBoard(row, col) && this.board[row][col] instanceof Domino) {
        if (this.board[row][col].getValue(row, col) === value) {
          return true;
        }
      }
    }
    return false;
  }

  isSameInCol(value, col) {
    for (let row = 0; row < this.size; row += 1) {
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
      const emptyCells = cellValue.findEmptyAdjCells();
      for (const [r, c] of emptyCells) {
        const directions = this.findDirections(r, c);
        if (directions.length !== 0) {
          return [[r, c], directions];
        }

        // Mark that we can not place a domino in this cell
        // this.board[r][c] = false;
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

          // Mark that we can not place a domino in this cell
          // this.board[i][j] = false;
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

    for (let row = r1 - 1; row < r1 + 2; row += 1) {
      for (let col = c1 - 1; col < c1 + 2; col += 1) {
        if (this.isOnBoard(row, col)) {
          if (!((row === r1 && col === c1) || (row === r2 && col === c2))) {
            if (this.board[row][col] instanceof Domino) {
              return true;
            }
          }
        }
      }
    }

    for (let row = r2 - 1; row < r2 + 2; row += 1) {
      for (let col = c2 - 1; col < c2 + 2; col += 1) {
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
    return this.availableDominos.filter(
      (domino) => !Domino.areTheSame(domino, dominoToRemove)
    );
  }

  markFinishedCells() {
    const finishedCells = [];
    this.cellValues.forEach((value) => {
      if (!value.done) {
        if (value.isSolved()) {
          value.done = true;
          value.markCells();
          finishedCells.push(value);
        }
      }
    });
    return finishedCells;
  }

  static unMarkFinishedCells(finishedCells) {
    finishedCells.forEach((cell) => {
      cell.unMarkCells();
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

  returnInitialDomino(initialDomino, place) {
    this.availableDominos.splice(place, 0, initialDomino);
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

  findAllSolutions() {
    const result = [];

    const solve = (dominoGrid) => {
      // console.log(copyDominoGrid(dominoGrid));
      // console.log(`Dominos length: ${dominoGrid.availableDominos.length}`);

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
        // const initialDominoGrid = copyDominoGrid(dominoGrid);
        for (let i = 0; i < dominoGrid.availableDominos.length; i += 1) {
          const currInitialDomino = copyDomino(dominoGrid.availableDominos[i]);
          const currDomino = dominoGrid.availableDominos[i];
          console.log(`in for loop, i: ${i}`);

          for (const direction of directions) {
            const isValid = dominoGrid.validate(currPos, direction, currDomino);

            if (isValid) {
              Domino.setupDomino(currDomino, currPos, direction);
              dominoGrid.placeDomino(currDomino);
              dominoGrid.availableDominos = dominoGrid.removeDomino(currDomino);
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

                if (cellValue && !cellValue.checkValidity()) {
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
              dominoGrid.availableDominos = dominoGrid.removeDomino(currDomino);
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
                  // throw new Error('solved');
                  return true;
                }

                if (cellValue && !cellValue.checkValidity()) {
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
    solve(copyDominoGrid(this));

    return result;
  }
}
