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
      console.log(dominoGrid);
      console.log(`Dominos length: ${dominoGrid.availableDominos.length}`);
      let [currPos, directions] = this.findAvailablePosition(dominoGrid);
      console.log(`Moves and directions: ${currPos} | ${directions}`);
      // if (dominoGrid.availableDominos.length < 8) throw Error('Caught');

      // if (dominoGrid.availableDominos.length === 1) throw Error('Finished');

      if (
        dominoGrid.availableDominos.length === 0 &&
        dominoGrid.cellValues.length === 0
      ) {
        // throw Error('Finished');
        console.log('finished');
        result.push(dominoGrid.board);
        console.log(dominoGrid.board);
        return;
      }

      if (!currPos) {
        console.log('finished');
        return;
      }

      while (currPos) {
        console.log(`Moves and directions: ${currPos} | ${directions}`);
        for (let i = 0; i < dominoGrid.availableDominos.length; i += 1) {
          const currDomino = copyDomino(dominoGrid.availableDominos[i]);
          console.log(`in for loop, i: ${i}`);

          directions.forEach((direction) =>
            handleDirection(
              currPos,
              direction,
              currDomino,
              copyDominoGrid(dominoGrid)
            )
          );

          if (currPos[0] === 8 && currPos[1] === 0) {
            console.log(dominoGrid);
            throw new Error('finished');
          }

          currDomino.rotated = true;
          [currDomino.a, currDomino.b] = [currDomino.b, currDomino.a];

          directions.forEach((direction) =>
            handleDirection(
              currPos,
              direction,
              currDomino,
              copyDominoGrid(dominoGrid)
            )
          );
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
    };

    function handleDirection(currPos, direction, currDomino, dominoGrid) {
      const isValid = dominoGrid.validate(
        currPos,
        direction,
        currDomino,
        dominoGrid
      );
      if (isValid) {
        // Set up Domino
        const [r, c] = currPos;
        currDomino.direction = direction;
        currDomino.tipRow = r;
        currDomino.tipCol = c;

        dominoGrid.placeDomino(currDomino, dominoGrid);

        if (
          dominoGrid.availableDominos.length === 0 &&
          dominoGrid.cellValues.length === 0
        ) {
          // throw Error('Finished');
          console.log('finished');
          result.push(dominoGrid.board);
          console.log(dominoGrid.board);
          return;
        }

        dominoGrid.availableDominos = dominoGrid.availableDominos.filter(
          (domino) =>
            !(
              (domino.a === currDomino.a && domino.b === currDomino.b) ||
              (domino.a === currDomino.b && domino.b === currDomino.a)
            )
        );

        if (dominoGrid.cellValues.length > 0) {
          // console.log('in if check');
          dominoGrid.cellValues.forEach((value) => {
            value.done = value.isSolved();
          });
          const cellValue = dominoGrid.cellValues.find((cell) => !cell.done);

          if (!cellValue) {
            return;
          }

          // while (cellValue.isSolved()) {
          //   // cellValue.markCells();
          //   cellValue.done = true;
          //   cellValue = dominoGrid.cellValues.find((cell) => !cell.done);
          //   if (!cellValue) {
          //     return;
          //   }
          // }

          if (!cellValue.checkValidity()) {
            // console.log('not valid cell placement');
            return;
          }
        }
        console.log('recursive call');
        solve(copyDominoGrid(dominoGrid));
      }
    }
    solve(copyDominoGrid(this));
  }
}
