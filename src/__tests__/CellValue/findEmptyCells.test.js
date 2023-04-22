import CellValue from '../../CellValue';
import DominoGrid from '../../DominoGrid';

describe('CellValue', () => {
  describe('findEmptyAdjCells', () => {
    test('should return an array of empty adjacent cells when there are empty cells', () => {
      const dominoGrid = {
        isPositionFree: jest.fn().mockImplementation((row, col) => {
          // Make all cells except the center one empty
          return !(row === 1 && col === 1);
        }),
        board: [],
      };
      const cellValue = new CellValue(5, 1, 1, dominoGrid);
      const expectedEmptyCells = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];
      expect(cellValue.findEmptyAdjCells()).toEqual(expectedEmptyCells);
    });

    test('should return an empty array when there are no empty adjacent cells', () => {
      const dominoGrid = {
        isPositionFree: jest.fn().mockReturnValue(false),
        board: [],
      };
      const cellValue = new CellValue(5, 1, 1, dominoGrid);
      expect(cellValue.findEmptyAdjCells()).toEqual([]);
    });

    test('should return an array of empty adjacent cells when a cell is on the edge', () => {
      const board = [
        [0, 0, new CellValue(2, 0, 2)],
        [0, 0, 1],
        [0, 0, 0],
      ];
      const dominoGrid = new DominoGrid(3, board);
      const cellValue = dominoGrid.cellValues[0];

      const emptyCells = cellValue.findEmptyAdjCells();

      expect(emptyCells).toEqual([
        [0, 1],
        [1, 1],
      ]);
    });
  });
});
