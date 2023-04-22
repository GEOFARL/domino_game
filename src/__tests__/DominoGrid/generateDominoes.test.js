import DominoGrid from '../../DominoGrid';

describe('DominoGrid', () => {
  describe('generateDominoes', () => {
    test('should generate the correct number of dominos', () => {
      const dominos = DominoGrid.generateDominoes();
      expect(dominos).toHaveLength(15);
    });

    test('should generate unique dominos', () => {
      const dominos = DominoGrid.generateDominoes();
      const dominoSet = new Set(dominos);
      expect(dominoSet.size).toBe(15);
    });

    test('should generate the correct set of dominos', () => {
      const dominos = DominoGrid.generateDominoes();
      const expectedDominos = [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
        { a: 1, b: 4 },
        { a: 1, b: 5 },
        { a: 1, b: 6 },
        { a: 2, b: 3 },
        { a: 2, b: 4 },
        { a: 2, b: 5 },
        { a: 2, b: 6 },
        { a: 3, b: 4 },
        { a: 3, b: 5 },
        { a: 3, b: 6 },
        { a: 4, b: 5 },
        { a: 4, b: 6 },
        { a: 5, b: 6 },
      ].map((domino) => expect.objectContaining(domino));
      expect(dominos).toEqual(expectedDominos);
    });
  });
});
