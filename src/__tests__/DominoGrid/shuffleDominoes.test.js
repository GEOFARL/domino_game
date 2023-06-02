import DominoGrid from '../../../src/gameLogic/DominoGrid';

describe('DominoGrid', () => {
  describe('shuffleDominoes', () => {
    let grid;
    beforeEach(() => {
      grid = new DominoGrid(9, []);
    });

    test('should shuffle the available dominos array', () => {
      const originalOrder = [...grid.availableDominos];

      grid.shuffleDominoes();

      expect(grid.availableDominos).not.toEqual(originalOrder);
    });

    test('should not modify the number of available dominos', () => {
      const originalLength = grid.availableDominos.length;

      grid.shuffleDominoes();

      expect(grid.availableDominos.length).toEqual(originalLength);
    });

    test('should not change the set of dominos', () => {
      const originalDominos = [...grid.availableDominos];

      grid.shuffleDominoes();

      expect(grid.availableDominos).toContainEqual(...originalDominos);
    });
  });
});
