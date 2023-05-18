import CellValue from '../gameLogic/CellValue';
import Domino from '../gameLogic/Domino';

export default class GridRenderer {
  static clearBoard(domGrid, dominoGrid) {
    for (let i = 0; i < dominoGrid.size; i += 1) {
      for (let j = 0; j < dominoGrid.size; j += 1) {
        domGrid[i][j].innerText = '';
        domGrid[i][j].className = '';
      }
    }
  }

  static displayBoard(dominoGrid, domGrid) {
    for (let i = 0; i < dominoGrid.size; i += 1) {
      for (let j = 0; j < dominoGrid.size; j += 1) {
        if (dominoGrid.board[i][j] instanceof CellValue) {
          domGrid[i][j].innerText = dominoGrid.board[i][j].value;
          domGrid[i][j].classList.add('number');
        } else if (dominoGrid.board[i][j] instanceof Domino) {
          domGrid[i][j].innerText = dominoGrid.board[i][j].getValue(i, j);
          domGrid[i][j].classList.add('domino');
        } else {
          domGrid[i][j].innerText = '';
        }
      }
    }
  }
}
