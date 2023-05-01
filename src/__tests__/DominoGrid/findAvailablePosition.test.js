import DominoGrid from '../../DominoGrid';
import Domino from '../../Domino';
import CellValue from '../../CellValue';

describe('DominoGrid', () => {
  describe('findAvailablePosition', () => {
    test('should return null if there are no available positions', () => {
      const board = [
        [1, 8],
        [9, 6],
      ];
      const dominoGrid = new DominoGrid(2, board);

      const result = dominoGrid.findAvailablePosition();

      expect(result).toBeNull();
    });

    test('should return the correct available position and directions', () => {
      let board = [
        [0, 5, 8],
        [0, 4, 9],
        [1, 1, 1],
      ];
      let dominoGrid = new DominoGrid(3, board);

      let result = dominoGrid.findAvailablePosition();
      expect(result).toEqual([[0, 0], [2]]);

      board = [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 1],
      ];

      dominoGrid.board = board;
      result = dominoGrid.findAvailablePosition();
      expect(result).toEqual([
        [1, 1],
        [1, 2],
      ]);
    });

    test('should mark cell in which is impossible to place a domino', () => {
      const board = [
        [0, 1, 1],
        [1, 1, 1],
        [1, 0, 0],
      ];
      const dominoGrid = new DominoGrid(3, board);

      const result = dominoGrid.findAvailablePosition();

      expect(result).toEqual([[2, 1], [1]]);
      expect(dominoGrid.board[0][0]).toBeFalsy();
    });
  });

  test('should prioritize cells with value first to find position', () => {
    const board = [
      [0, 1, 0, 0],
      [1, 1, 1, 5],
      [1, new CellValue(8, 2, 1), 0, 0],
      [0, 0, 0, 0],
    ];
    const dominoGrid = new DominoGrid(4, board);

    const emptyCells = dominoGrid.findEmptyAdjCells(dominoGrid.cellValues[0]);
    expect(emptyCells).toEqual([
      [2, 2],
      [3, 0],
      [3, 1],
      [3, 2],
    ]);

    const result = dominoGrid.findAvailablePosition();
    expect(dominoGrid.cellValues).toHaveLength(1);
    expect(result).toEqual([
      [2, 2],
      [1, 2],
    ]);
  });
});
