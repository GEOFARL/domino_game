import CellValue from '../../CellValue';
import Domino from '../../Domino';
import DominoGrid from '../../DominoGrid';

describe('DominoGrid', () => {
  describe('isSameInRow', () => {
    let board;

    beforeEach(() => {
      board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
    });

    test('should return true if there is a domino with the same value in the row', () => {
      const dominoGrid = new DominoGrid(3, board);
      const domino = new Domino(2, 4);
      domino.tipCol = 1;
      domino.tipRow = 1;
      dominoGrid.board[1][1] = domino;
      expect(dominoGrid.isSameInRow(2, 1)).toBe(true);
    });

    test('should return false if there is no domino with the same value in the row', () => {
      const dominoGrid = new DominoGrid(3, board);
      const domino = new Domino(2, 4);
      domino.tipCol = 0;
      domino.tipRow = 1;
      dominoGrid.board[1][0] = domino;
      expect(dominoGrid.isSameInRow(5, 1)).toBe(false);
    });

    test('should return false if the row is empty', () => {
      const dominoGrid = new DominoGrid(3, board);
      expect(dominoGrid.isSameInRow(3, 0)).toBe(false);
    });

    test('should work with multiple dominoes and cellValues', () => {
      const domino1 = new Domino(1, 5);
      domino1.direction = 1;
      domino1.tipRow = 0;
      domino1.tipCol = 3;

      const domino2 = new Domino(4, 1);
      domino2.direction = 2;
      domino2.tipRow = 1;
      domino2.tipCol = 3;

      const board = [
        [0, 0, new CellValue(5, 0, 2), domino1, domino1],
        [0, new CellValue(2, 1, 1), 0, domino2, 0],
        [new CellValue(2, 2, 0), 0, 0, domino2, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(5, board);
      expect(dominoGrid.isSameInRow(4, 1)).toBeTruthy();
      expect(dominoGrid.isSameInRow(2, 2)).toBeFalsy();
    });
  });

  describe('isSameInCol', () => {
    let board;

    beforeEach(() => {
      board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
    });

    test('should return true if there is a domino with the same value in the column', () => {
      const dominoGrid = new DominoGrid(3, board);
      const domino = new Domino(2, 4);
      domino.tipCol = 1;
      domino.tipRow = 1;
      dominoGrid.board[1][1] = domino;
      expect(dominoGrid.isSameInCol(2, 1)).toBe(true);
    });

    test('should return false if there is no domino with the same value in the column', () => {
      const dominoGrid = new DominoGrid(3, board);
      const domino = new Domino(2, 4);
      domino.tipCol = 0;
      domino.tipRow = 1;
      dominoGrid.board[1][0] = domino;
      expect(dominoGrid.isSameInCol(5, 0)).toBe(false);
    });

    test('should return false if the column is empty', () => {
      const dominoGrid = new DominoGrid(3, board);
      expect(dominoGrid.isSameInCol(3, 0)).toBe(false);
    });

    test('should work with multiple dominoes and cellValues', () => {
      const domino1 = new Domino(1, 5);
      domino1.direction = 1;
      domino1.tipRow = 0;
      domino1.tipCol = 3;

      const domino2 = new Domino(4, 1);
      domino2.direction = 2;
      domino2.tipRow = 1;
      domino2.tipCol = 3;

      const board = [
        [0, 0, new CellValue(5, 0, 2), domino1, domino1],
        [0, new CellValue(2, 1, 1), 0, domino2, 0],
        [new CellValue(2, 2, 0), 0, 0, domino2, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(5, board);
      expect(dominoGrid.isSameInCol(1, 3)).toBeTruthy();
      expect(dominoGrid.isSameInCol(3, 3)).toBeFalsy();
    });
  });

  describe('isAdjDomino', () => {
    let board;

    beforeEach(() => {
      board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
    });

    test('should return false when no adjacent domino is found', () => {
      const dominoGrid = new DominoGrid(3, board);
      expect(dominoGrid.isAdjDomino([1, 1], 1)).toBe(false);
    });

    test('should return true when adjacent domino is found horizontally', () => {
      const domino1 = new Domino(2, 4);
      domino1.direction = 1;
      domino1.tipRow = 1;
      domino1.tipCol = 0;

      const dominoGrid = new DominoGrid(3, board);
      dominoGrid.board[1][0] = domino1;

      expect(dominoGrid.isAdjDomino([1, 1], 1)).toBe(true);
    });

    test('should return true when adjacent domino is found vertically', () => {
      const domino1 = new Domino(2, 4);
      domino1.direction = 2;
      domino1.tipRow = 0;
      domino1.tipCol = 1;

      const dominoGrid = new DominoGrid(3, board);
      dominoGrid.board[0][1] = domino1;

      expect(dominoGrid.isAdjDomino([1, 1], 2)).toBe(true);
    });

    test('should return true when adjacent domino is found diagonally', () => {
      const domino1 = new Domino(2, 4);
      domino1.direction = 2;
      domino1.tipRow = 0;
      domino1.tipCol = 0;

      const dominoGrid = new DominoGrid(3, board);
      dominoGrid.board[0][0] = domino1;

      expect(dominoGrid.isAdjDomino([1, 1], 2)).toBe(true);
    });

    test('should return false when adjacent cell is empty', () => {
      const dominoGrid = new DominoGrid(3, board);
      expect(dominoGrid.isAdjDomino([1, 1], 1)).toBe(false);
    });

    test('should work with multiple dominoes on the board', () => {
      board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      const domino1 = new Domino(2, 4);
      domino1.direction = 2;
      domino1.tipRow = 0;
      domino1.tipCol = 0;

      const domino2 = new Domino(3, 5);
      domino2.direction = 1;
      domino2.tipRow = 1;
      domino2.tipCol = 2;

      const dominoGrid = new DominoGrid(4, board);
      dominoGrid.board[0][0] = domino1;
      dominoGrid.board[1][0] = domino1;

      dominoGrid.board[1][2] = domino2;
      dominoGrid.board[1][3] = domino2;

      expect(dominoGrid.isAdjDomino([0, 1], 2)).toBe(true);
      expect(dominoGrid.isAdjDomino([2, 2], 1)).toBe(true);
      expect(dominoGrid.isAdjDomino([3, 0], 1)).toBe(false);
    });
  });

  describe('validate', () => {
    test('should validate position correctly', () => {
      const domino1 = new Domino(3, 4);
      domino1.direction = 2;
      domino1.tipRow = 0;
      domino1.tipCol = 0;

      const domino2 = new Domino(1, 5);
      domino2.direction = 3;
      domino2.tipRow = 2;
      domino2.tipCol = 3;

      const board = [
        [domino1, 0, 0, 0],
        [domino1, new CellValue(12, 1, 1), 0, 0],
        [0, 0, domino2, domino2],
        [0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(4, board);

      [0, 1, 2, 3].forEach((direction) => {
        expect(
          dominoGrid.validate([3, 0], direction, new Domino(2, 6))
        ).toBeFalsy();
      });

      expect(dominoGrid.validate([0, 3], 0, new Domino(2, 6))).toBeFalsy();
      expect(dominoGrid.validate([0, 3], 1, new Domino(2, 6))).toBeFalsy();
      expect(dominoGrid.validate([0, 3], 2, new Domino(2, 6))).toBeFalsy();
      expect(dominoGrid.validate([0, 3], 3, new Domino(2, 6))).toBeTruthy();
    });
  });
});
