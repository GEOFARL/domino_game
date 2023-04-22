import DominoGrid from '../../DominoGrid';
import Domino from '../../Domino';

describe('DominoGrid', () => {
  describe('placeDomino', () => {
    test('should place domino correctly', () => {
      const board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];

      const dominoGrid = new DominoGrid(5, board);

      const domino1 = new Domino(4, 5);
      domino1.direction = 2;
      domino1.tipRow = 0;
      domino1.tipCol = 0;

      dominoGrid.placeDomino(domino1);

      expect(dominoGrid.board[0][0]).toBe(domino1);
      expect(dominoGrid.board[1][0]).toBe(domino1);
      expect(dominoGrid.board[2][0]).not.toBe(domino1);
      expect(dominoGrid.board[0][1]).not.toBe(domino1);

      const domino2 = new Domino(2, 6);
      domino2.direction = 3;
      domino2.tipRow = 3;
      domino2.tipCol = 3;

      dominoGrid.placeDomino(domino2);

      expect(dominoGrid.board[3][3]).toBe(domino2);
      expect(dominoGrid.board[3][2]).toBe(domino2);
      expect(dominoGrid.board[3][4]).not.toBe(domino2);
      expect(dominoGrid.board[4][3]).not.toBe(domino2);
    });
  });
});
