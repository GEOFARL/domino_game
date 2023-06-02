import CellValue from '../../../src/gameLogic/CellValue';
import DominoGrid from '../../../src/gameLogic/DominoGrid';

describe('CellValue', () => {
  describe('findEmptyAdjCells', () => {
    test('should return an array of empty adjacent cells when a cell is on the edge', () => {
      const board = [
        [0, 0, new CellValue(2, 0, 2)],
        [0, 0, 1],
        [0, 0, 0],
      ];
      const dominoGrid = new DominoGrid(3, board);
      const cellValue = dominoGrid.cellValues[0];

      const emptyCells = dominoGrid.findEmptyAdjCells(cellValue);

      expect(emptyCells).toEqual([
        [0, 1],
        [1, 1],
      ]);
    });
  });
});
