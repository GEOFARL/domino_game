import CellValue from '../../CellValue';
import Domino from '../../Domino';
import DominoGrid from '../../DominoGrid';

describe('CellValue', () => {
  describe('checkValidity', () => {
    test('should return true if the position can be solved', () => {
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

      const isValid = dominoGrid.checkValidity(cellValue);

      expect(isValid).toBeTruthy();
    });

    test('should return false if the position cannot be solved because of empty possible moves', () => {
      const domino1 = new Domino(3, 4);
      domino1.direction = 2;
      domino1.tipRow = 0;
      domino1.tipCol = 0;

      const domino2 = new Domino(1, 5);
      domino2.direction = 3;
      domino2.tipRow = 2;
      domino2.tipCol = 3;

      const board = [
        [domino1, 0, 1, 0],
        [domino1, new CellValue(12, 1, 1), 1, 0],
        [0, 1, domino2, domino2],
        [1, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(4, board);
      const cellValue = dominoGrid.board[1][1];

      const isValid = dominoGrid.checkValidity(cellValue);

      expect(isValid).toBeFalsy();
    });
  });

  test('should return false if the sum of adj cells is greater than cell value', () => {
    const domino1 = new Domino(3, 4);
    domino1.direction = 1;
    domino1.tipRow = 0;
    domino1.tipCol = 1;

    const domino2 = new Domino(1, 5);
    domino2.direction = 2;
    domino2.tipRow = 1;
    domino2.tipCol = 3;

    const board = [
      [0, domino1, domino1, new CellValue(3, 0, 3)],
      [0, 0, 0, domino2],
      [0, 0, 0, domino2],
      [0, 0, 0, 0],
    ];

    const dominoGrid = new DominoGrid(4, board);
    const cellValue = dominoGrid.board[0][3];

    const isValid = dominoGrid.checkValidity(cellValue);

    expect(isValid).toBeFalsy();
  });
});
