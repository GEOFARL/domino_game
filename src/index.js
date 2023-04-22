import './template.html';
import './styles.css';

import DominoGrid from './DominoGrid';
import UI from './UI';
import CellValue from './CellValue';

const board = new DominoGrid(9, [
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

const ui = new UI(board);

console.log(board.findAllSolutions());

console.log(board);
console.log(ui);
