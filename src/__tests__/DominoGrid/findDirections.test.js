import CellValue from '../../CellValue';
import DominoGrid from '../../DominoGrid';

describe('DominoGrid', () => {
  describe('findDirections', () => {
    let dominoGrid;

    beforeEach(() => {
      // create a new domino grid for each test
      const board = Array(5)
        .fill(0)
        .map((_) => Array(5).fill(0));
      dominoGrid = new DominoGrid(5, board);
    });

    test('should return an array of directions for a cell with all adjacent positions free', () => {
      // set up board so that all positions adjacent to [2,2] are free
      dominoGrid.board[1][1] = new CellValue(4, 1, 1, dominoGrid);
      dominoGrid.board[1][3] = new CellValue(2, 1, 3, dominoGrid);
      dominoGrid.board[3][1] = new CellValue(5, 3, 1, dominoGrid);
      dominoGrid.board[3][3] = new CellValue(3, 3, 3, dominoGrid);

      const directions = dominoGrid.findDirections(2, 2);

      expect(directions).toContain(0);
      expect(directions).toContain(1);
      expect(directions).toContain(2);
      expect(directions).toContain(3);
    });

    test('should return an array of directions for a cell with some adjacent positions occupied', () => {
      // set up board so that the position to the north of [2,2] is occupied
      dominoGrid.board[1][2] = new CellValue(4, 1, 2, dominoGrid);

      const directions = dominoGrid.findDirections(2, 2);

      expect(directions).not.toContain(0);
      expect(directions).toContain(1);
      expect(directions).toContain(2);
      expect(directions).toContain(3);
    });

    test('should return an array of directions for a cell on the edge of the board', () => {
      // set up board so that all positions adjacent to [2,4] are free
      dominoGrid.board[2][3] = new CellValue(5, 2, 3, dominoGrid);
      dominoGrid.board[3][4] = new CellValue(6, 3, 4, dominoGrid);

      const directions = dominoGrid.findDirections(2, 4);

      expect(directions).toContain(0);
      expect(directions).not.toContain(2);
      expect(directions).not.toContain(3);
      expect(directions).not.toContain(1);
    });
  });
});
