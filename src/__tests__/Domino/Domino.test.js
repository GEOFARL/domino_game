import Domino from '../../../src/gameLogic/Domino';

describe('Domino', () => {
  test('should have a and b properties', () => {
    const domino = new Domino(1, 2);
    expect(domino.a).toEqual(1);
    expect(domino.b).toEqual(2);
  });

  test('should have a random direction', () => {
    const domino = new Domino(1, 2);
    const directions = [0, 1, 2, 3];
    expect(directions).toContain(domino.direction);
  });

  test('should return the correct value based on row and col', () => {
    const domino = new Domino(3, 4);
    domino.tipRow = 0;
    domino.tipCol = 0;
    expect(domino.getValue(0, 0)).toEqual(3);
    expect(domino.getValue(0, 1)).toEqual(4);
    expect(domino.getValue(1, 0)).toEqual(4);
    expect(domino.getValue(1, 1)).toEqual(4);
  });
});
