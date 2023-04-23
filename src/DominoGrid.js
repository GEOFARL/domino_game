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

  placeDomino(domino, dominoGrid = this) {
    const r1 = domino.tipRow;
    const c1 = domino.tipCol;

    const [offR, offC] = DominoGrid.offsets[domino.direction];
    const r2 = r1 + offR;
    const c2 = c1 + offC;

    dominoGrid.board[r1][c1] = domino;
    dominoGrid.board[r2][c2] = domino;
  }

  static unPlaceDomino(domino, dominoGrid) {
    const r1 = domino.tipRow;
    const c1 = domino.tipCol;

    const [offR, offC] = DominoGrid.offsets[domino.direction];
    const r2 = r1 + offR;
    const c2 = c1 + offC;

    dominoGrid.board[r1][c1] = 0;
    dominoGrid.board[r2][c2] = 0;
  }

  isSameInRow(value, row, dominoGrid = this) {
    for (let col = 0; col < dominoGrid.size; col += 1) {
      if (
        dominoGrid.isOnBoard(row, col) &&
        dominoGrid.board[row][col] instanceof Domino
      ) {
        if (dominoGrid.board[row][col].getValue(row, col) === value) {
          return true;
        }
      }
    }
    return false;
  }

  isSameInCol(value, col, dominoGrid = this) {
    for (let row = 0; row < dominoGrid.size; row += 1) {
      if (
        dominoGrid.isOnBoard(row, col) &&
        dominoGrid.board[row][col] instanceof Domino
      ) {
        if (dominoGrid.board[row][col].getValue(row, col) === value) {
          return true;
        }
      }
    }
    return false;
  }

  isOnBoard(row, col, board = this.board) {
    const rows = board.length;
    const cols = board[0].length;
    return row >= 0 && row < rows && col >= 0 && col < cols;
  }

  isPositionFree(row, col, board = this.board) {
    if (!this.isOnBoard(row, col, board)) {
      return false;
    }
    return board[row][col] === 0;
  }

  findDirections(row, col, dominoGrid = this) {
    const directions = [];
    if (dominoGrid.isPositionFree(row - 1, col, dominoGrid.board)) {
      // North
      directions.push(0);
    }

    // East
    if (dominoGrid.isPositionFree(row, col + 1, dominoGrid.board)) {
      directions.push(1);
    }

    // South
    if (dominoGrid.isPositionFree(row + 1, col, dominoGrid.board)) {
      directions.push(2);
    }

    // West
    if (dominoGrid.isPositionFree(row, col - 1, dominoGrid.board)) {
      directions.push(3);
    }

    return directions;
  }

  findAvailablePosition(dominoGrid = this) {
    if (
      dominoGrid.cellValues.length !== 0 &&
      dominoGrid.cellValues.find((cell) => !cell.done)
    ) {
      const cellValue = dominoGrid.cellValues.find((cell) => !cell.done);
      const emptyCells = cellValue.findEmptyAdjCells();
      for (const [r, c] of emptyCells) {
        const directions = this.findDirections(r, c, dominoGrid);
        if (directions.length !== 0) {
          return [[r, c], directions];
        }

        // Mark that we can not place a domino in this cell
        // dominoGrid.board[r][c] = false;
      }
      return null;
    }

    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (dominoGrid.isPositionFree(i, j, dominoGrid.board)) {
          const directions = this.findDirections(i, j, dominoGrid);
          if (directions.length !== 0) {
            return [[i, j], directions];
          }

          // Mark that we can not place a domino in this cell
          // dominoGrid.board[i][j] = false;
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

  static removeDomino(dominoToRemove, dominoGrid) {
    return dominoGrid.availableDominos.filter(
      (domino) => !Domino.areTheSame(domino, dominoToRemove)
    );
  }

  static markFinishedCells(dominoGrid) {
    const finishedCells = [];
    dominoGrid.cellValues.forEach((value) => {
      if (!value.done) {
        if (value.isSolved()) {
          value.done = true;
          finishedCells.push(value);
        }
      }
    });
    return finishedCells;
  }

  static findUnFinishedCells(dominoGrid) {
    const unfinishedCells = [];
    dominoGrid.cellValues.forEach((value) => {
      if (!value.done) {
        unfinishedCells.push(value);
      }
    });
    return unfinishedCells;
  }

  static unMarkFinishedCells(finishedCells) {
    finishedCells.forEach((cell) => {
      cell.done = false;
    });
  }

  static returnInitialDomino(initialDomino, place, dominoGrid) {
    dominoGrid.availableDominos.splice(place, 0, initialDomino);
  }

  validate(pos, direction, domino, dominoGrid = this) {
    const [r1, c1] = pos;
    const [rOff, cOff] = DominoGrid.offsets[direction];
    const r2 = r1 + rOff;
    const c2 = c1 + cOff;

    if (!dominoGrid.isOnBoard(r2, c2)) {
      return false;
    }
    if (
      dominoGrid.isSameInRow(domino.a, r1) ||
      dominoGrid.isSameInCol(domino.a, c1)
    ) {
      return false;
    }
    if (
      dominoGrid.isSameInRow(domino.b, r2) ||
      dominoGrid.isSameInCol(domino.b, c2)
    ) {
      return false;
    }

    if (dominoGrid.isAdjDomino([r1, c1], direction)) {
      return false;
    }

    return true;
  }

  findAllSolutions() {
    const result = [];

    const solve = (dominoGrid) => {
      console.log(copyDominoGrid(dominoGrid));
      console.log(`Dominos length: ${dominoGrid.availableDominos.length}`);

      const val = this.findAvailablePosition(dominoGrid);
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
            const isValid = dominoGrid.validate(
              currPos,
              direction,
              currDomino,
              dominoGrid
            );

            if (isValid) {
              Domino.setupDomino(currDomino, currPos, direction);
              dominoGrid.placeDomino(currDomino, dominoGrid);
              dominoGrid.availableDominos = DominoGrid.removeDomino(
                currDomino,
                dominoGrid
              );
              const unFinishedCells =
                DominoGrid.findUnFinishedCells(dominoGrid);
              let finishedCells;

              if (unFinishedCells.length > 0) {
                finishedCells = DominoGrid.markFinishedCells(dominoGrid);
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

                if (!cellValue.checkValidity()) {
                  if (finishedCells.length > 0) {
                    DominoGrid.unMarkFinishedCells(finishedCells);
                  }
                  DominoGrid.returnInitialDomino(
                    currInitialDomino,
                    i,
                    dominoGrid
                  );
                  DominoGrid.unPlaceDomino(currDomino, dominoGrid);
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
              if (finishedCells.length > 0) {
                DominoGrid.unMarkFinishedCells(finishedCells);
              }
              DominoGrid.returnInitialDomino(currInitialDomino, i, dominoGrid);
              DominoGrid.unPlaceDomino(currDomino, dominoGrid);
            }
          }

          Domino.rotateDomino(currDomino);

          for (const direction of directions) {
            const isValid = dominoGrid.validate(
              currPos,
              direction,
              currDomino,
              dominoGrid
            );

            if (isValid) {
              Domino.setupDomino(currDomino, currPos, direction);
              dominoGrid.placeDomino(currDomino, dominoGrid);
              dominoGrid.availableDominos = DominoGrid.removeDomino(
                currDomino,
                dominoGrid
              );
              const unFinishedCells =
                DominoGrid.findUnFinishedCells(dominoGrid);
              let finishedCells;

              if (unFinishedCells.length > 0) {
                finishedCells = DominoGrid.markFinishedCells(dominoGrid);
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

                if (!cellValue.checkValidity()) {
                  if (finishedCells.length > 0) {
                    DominoGrid.unMarkFinishedCells(finishedCells);
                  }
                  DominoGrid.returnInitialDomino(
                    currInitialDomino,
                    i,
                    dominoGrid
                  );
                  DominoGrid.unPlaceDomino(currDomino, dominoGrid);
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
              if (finishedCells.length > 0) {
                DominoGrid.unMarkFinishedCells(finishedCells);
              }
              DominoGrid.returnInitialDomino(currInitialDomino, i, dominoGrid);
              DominoGrid.unPlaceDomino(currDomino, dominoGrid);
            }
          }
        }
        const [r, c] = currPos;
        dominoGrid.board[r][c] = false;
        const a = this.findAvailablePosition(dominoGrid);
        if (a) {
          [currPos, directions] = a;
        } else {
          currPos = null;
        }
      }
      return false;
    };

    // function handleDirection(currPos, direction, currDomino, dominoGrid) {
    //   const isValid = dominoGrid.validate(
    //     currPos,
    //     direction,
    //     currDomino,
    //     dominoGrid
    //   );
    //   if (isValid) {
    //     Domino.setupDomino(currDomino, currPos, direction);
    //     dominoGrid.placeDomino(currDomino, dominoGrid);
    //     dominoGrid.availableDominos = DominoGrid.removeDomino(
    //       currDomino,
    //       dominoGrid
    //     );

    //     if (dominoGrid.cellValues.length > 0) {
    //       DominoGrid.markFinishedCells(dominoGrid);
    //       const cellValue = dominoGrid.cellValues.find((cell) => !cell.done);

    //       if (dominoGrid.availableDominos.length === 0 && !cellValue) {
    //         console.log('finished');
    //         // result.push(dominoGrid);
    //         console.log(dominoGrid);
    //         // throw new Error('solved');
    //         return true;
    //       }

    //       if (!cellValue) {
    //         return false;
    //       }

    //       if (!cellValue.checkValidity()) {
    //         return false;
    //       }
    //     } else if (dominoGrid.availableDominos.length === 0) {
    //       console.log('finished');
    //       console.log(dominoGrid);
    //       return true;
    //     }
    //     console.log('recursive call');
    //     solve(copyDominoGrid(dominoGrid));
    //   }
    // }
    solve(copyDominoGrid(this));

    return result;
  }
}
