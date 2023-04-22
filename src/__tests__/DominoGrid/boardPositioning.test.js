import DominoGrid from '../../DominoGrid';
import Domino from '../../Domino';

describe('DominoGrid', () => {
  describe('isOnBoard', () => {
    let dominoGrid;

    beforeEach(() => {
      dominoGrid = new DominoGrid();
      // Testing with a 5x5 board
      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];
      dominoGrid.board = board;
    });

    test('isOnBoard returns true for valid positions', () => {
      // Testing with coordinates within the board boundaries
      expect(dominoGrid.isOnBoard(0, 0)).toBe(true);
      expect(dominoGrid.isOnBoard(2, 3)).toBe(true);
      expect(dominoGrid.isOnBoard(4, 4)).toBe(true);
    });

    test('isOnBoard returns false for invalid positions', () => {
      // Testing with coordinates outside the board boundaries
      expect(dominoGrid.isOnBoard(-1, 0)).toBe(false);
      expect(dominoGrid.isOnBoard(0, 5)).toBe(false);
      expect(dominoGrid.isOnBoard(3, -2)).toBe(false);
      expect(dominoGrid.isOnBoard(6, 6)).toBe(false);
    });
  });

  describe('isPositionFree', () => {
    let dominoGrid;

    beforeEach(() => {
      dominoGrid = new DominoGrid();
    });

    test('should return true if the position is within the board boundaries and is not occupied with any number except 0', () => {
      const row = 0;
      const col = 0;
      const board = [
        [0, 0],
        [0, 0],
      ];
      expect(dominoGrid.isPositionFree(row, col, board)).toBe(true);
    });

    test('should return false if the position is within the board boundaries and is occupied with a number other than 0', () => {
      const row = 0;
      const col = 0;
      const board = [
        [1, 0],
        [0, 0],
      ];
      expect(dominoGrid.isPositionFree(row, col, board)).toBe(false);
    });

    test('should return false if the position is within the board boundaries and is occupied with a domino object', () => {
      const row = 0;
      const col = 0;
      const board = [
        [new Domino(1, 2), 0],
        [0, 0],
      ];
      expect(dominoGrid.isPositionFree(row, col, board)).toBe(false);
    });

    test('should return false if the position is outside the board boundaries', () => {
      const row = 5;
      const col = 5;
      const board = [
        [0, 0],
        [0, 0],
      ];
      expect(dominoGrid.isPositionFree(row, col, board)).toBe(false);
    });
  });
});
