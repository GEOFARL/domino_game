import CellValue from './CellValue';
import DominoGrid from './DominoGrid';

const board1 = new DominoGrid(9, [
  [
    0,
    new CellValue(14, 0, 1),
    0,
    0,
    new CellValue(14, 0, 4),
    0,
    new CellValue(11, 0, 6),
    0,
    0,
  ],
  [
    0,
    0,
    new CellValue(10, 1, 2),
    new CellValue(10, 1, 3),
    0,
    0,
    new CellValue(14, 1, 6),
    new CellValue(8, 1, 7),
    new CellValue(8, 1, 8),
  ],
  [
    new CellValue(6, 2, 0),
    new CellValue(13, 2, 1),
    0,
    new CellValue(12, 2, 3),
    0,
    new CellValue(12, 2, 5),
    0,
    0,
    0,
  ],
  [
    0,
    new CellValue(14, 3, 1),
    0,
    0,
    0,
    0,
    new CellValue(5, 3, 6),
    new CellValue(10, 3, 7),
    new CellValue(10, 3, 8),
  ],
  [
    0,
    0,
    new CellValue(6, 4, 2),
    0,
    new CellValue(17, 4, 4),
    new CellValue(17, 4, 5),
    0,
    0,
    0,
  ],
  [
    new CellValue(12, 5, 0),
    0,
    new CellValue(4, 5, 2),
    new CellValue(6, 5, 3),
    0,
    0,
    0,
    new CellValue(10, 5, 7),
    new CellValue(10, 5, 8),
  ],
  [
    0,
    0,
    new CellValue(6, 6, 2),
    0,
    new CellValue(13, 6, 4),
    new CellValue(15, 6, 5),
    0,
    0,
    0,
  ],
  [0, new CellValue(11, 7, 1), 0, 0, 0, 0, 0, 0, 0],
  [
    0,
    0,
    new CellValue(11, 8, 2),
    0,
    new CellValue(8, 8, 4),
    new CellValue(6, 8, 5),
    0,
    new CellValue(9, 8, 7),
    new CellValue(3, 8, 8),
  ],
]);

const board2 = new DominoGrid(9, [
  [
    0,
    0,
    new CellValue(11, 0, 2),
    0,
    0,
    0,
    new CellValue(9, 0, 6),
    new CellValue(10, 0, 7),
    new CellValue(10, 0, 8),
  ],
  [new CellValue(9, 1, 0), 0, new CellValue(13, 1, 2), 0, 0, 0, 0, 0, 0],
  [
    new CellValue(8, 2, 0),
    0,
    new CellValue(12, 2, 2),
    new CellValue(7, 2, 3),
    new CellValue(8, 2, 4),
    new CellValue(9, 2, 5),
    0,
    new CellValue(17, 2, 7),
    0,
  ],
  [
    new CellValue(8, 3, 0),
    0,
    new CellValue(9, 3, 2),
    0,
    0,
    new CellValue(12, 3, 5),
    0,
    new CellValue(14, 3, 7),
    0,
  ],
  [
    new CellValue(17, 4, 0),
    0,
    new CellValue(16, 4, 2),
    new CellValue(9, 4, 3),
    0,
    new CellValue(13, 4, 5),
    0,
    0,
    0,
  ],
  [
    0,
    0,
    0,
    0,
    0,
    new CellValue(5, 5, 5),
    new CellValue(5, 5, 6),
    new CellValue(14, 5, 7),
    new CellValue(10, 5, 8),
  ],
  [
    0,
    new CellValue(20, 6, 1),
    0,
    new CellValue(11, 6, 3),
    0,
    new CellValue(7, 6, 5),
    new CellValue(7, 6, 6),
    0,
    0,
  ],
  [0, 0, 0, 0, new CellValue(11, 7, 4), 0, 0, 0, new CellValue(14, 7, 8)],
  [
    0,
    new CellValue(10, 8, 1),
    new CellValue(6, 8, 2),
    new CellValue(6, 8, 3),
    new CellValue(11, 8, 4),
    0,
    new CellValue(11, 8, 6),
    0,
    0,
  ],
]);

const board3 = new DominoGrid(9, [
  [0, 0, 0, new CellValue(12, 0, 3), 0, 0, 0, 0, new CellValue(2, 0, 8)],
  [
    0,
    0,
    0,
    new CellValue(12, 1, 3),
    0,
    0,
    new CellValue(8, 1, 6),
    new CellValue(11, 1, 7),
    new CellValue(5, 1, 8),
  ],
  [
    new CellValue(14, 2, 0),
    new CellValue(16, 2, 1),
    new CellValue(6, 2, 2),
    new CellValue(7, 2, 3),
    new CellValue(7, 2, 4),
    new CellValue(10, 2, 5),
    new CellValue(6, 2, 6),
    new CellValue(13, 2, 7),
    0,
  ],
  [0, 0, 0, 0, new CellValue(5, 3, 4), 0, 0, 0, 0],
  [
    0,
    0,
    new CellValue(6, 4, 2),
    0,
    new CellValue(11, 4, 4),
    new CellValue(12, 4, 5),
    new CellValue(13, 4, 6),
    0,
    0,
  ],
  [
    0,
    new CellValue(6, 5, 1),
    new CellValue(6, 5, 2),
    0,
    new CellValue(16, 5, 4),
    0,
    new CellValue(12, 5, 6),
    0,
    0,
  ],
  [
    0,
    new CellValue(6, 6, 1),
    0,
    0,
    new CellValue(14, 6, 4),
    0,
    new CellValue(16, 6, 6),
    new CellValue(10, 6, 7),
    new CellValue(10, 6, 8),
  ],
  [
    new CellValue(7, 7, 0),
    new CellValue(12, 7, 1),
    0,
    0,
    new CellValue(15, 7, 4),
    0,
    0,
    0,
    new CellValue(7, 7, 8),
  ],
  [new CellValue(5, 8, 0), 0, 0, 0, 0, 0, 0, 0, new CellValue(7, 8, 8)],
]);

const board4 = new DominoGrid(9, [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]);

const board5 = new DominoGrid(9, [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, new CellValue(20, 1, 1), 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, new CellValue(8, 2, 7), 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, new CellValue(8, 4, 3), 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, new CellValue(9, 7, 1), 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]);

const boards = [board1, board2, board3, board4, board5];

export default boards;
