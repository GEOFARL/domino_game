import CellValue from '../../CellValue';
import DominoGrid from '../../DominoGrid';
import Domino from '../../Domino';

describe('CellValue', () => {
  describe('findAdjSum', () => {
    test('should return the correct sum for a CellValue with two adjacent Dominos', () => {
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
        [domino1, new CellValue(2, 1, 1), 0, 0],
        [0, 0, domino2, domino2],
        [0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(4, board);
      const cellValue = dominoGrid.board[1][1];

      const sum = cellValue.findAdjSum();

      expect(sum).toBe(12);
    });

    test('should return the correct sum for a CellValue with cell in the corner', () => {
      const domino1 = new Domino(6, 1);
      domino1.direction = 0;
      domino1.tipRow = 2;
      domino1.tipCol = 0;

      const board = [
        [new CellValue(5, 0, 0), 0, 0, 0],
        [domino1, 0, 0, 0],
        [domino1, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(4, board);
      const cellValue = dominoGrid.board[0][0];

      const sum = cellValue.findAdjSum();

      expect(sum).toBe(1);
    });

    test('should return 0 when there are no adjacent dominoes', () => {
      const board = [
        [0, 0, 0, 0],
        [0, new CellValue(5, 0, 0), 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(4, board);
      const cellValue = dominoGrid.board[1][1];

      const sum = cellValue.findAdjSum();

      expect(sum).toBe(0);
    });
  });
});
