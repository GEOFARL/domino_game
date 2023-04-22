import CellValue from '../../CellValue';
import Domino from '../../Domino';
import DominoGrid from '../../DominoGrid';

describe('CellValue', () => {
  describe('isSolved', () => {
    test('should return true if the sum of adj cells is equal to cell value', () => {
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
      const cellValue = dominoGrid.board[1][1];

      const isSolved = cellValue.isSolved();

      expect(isSolved).toBeTruthy();
    });

    test('should return false if the sum of adj cells is not equal to cell value', () => {
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
        [domino1, new CellValue(10, 1, 1), 0, 0],
        [0, 0, domino2, domino2],
        [0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(4, board);
      const cellValue = dominoGrid.board[1][1];

      const isSolved = cellValue.isSolved();

      expect(isSolved).toBeFalsy();
    });
  });
});
