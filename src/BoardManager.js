import CellValue from './CellValue';
import DominoGrid from './DominoGrid';
import InputHandler from './InputHandler';

export default class BoardManager {
  constructor(domGrid) {
    this.domGrid = domGrid;
    this.inputHandler = new InputHandler();
  }

  addNewBoard(dominoGrid) {
    for (let i = 0; i < dominoGrid.size; i += 1) {
      for (let j = 0; j < dominoGrid.size; j += 1) {
        this.domGrid[i][j].innerHTML = `<input type="text" maxlength="2" />`;
        this.domGrid[i][j]
          .querySelector('input')
          .addEventListener('blur', (e) =>
            InputHandler.handleNumberInput(e.target)
          );
      }
    }
  }

  solveYourself(dominoGrid, message, finishSolvingBtn) {
    for (let i = 0; i < dominoGrid.size; i += 1) {
      for (let j = 0; j < dominoGrid.size; j += 1) {
        if (!(dominoGrid.board[i][j] instanceof CellValue)) {
          this.domGrid[i][j].innerHTML = `<input type="text" maxlength="2" />`;

          this.domGrid[i][j]
            .querySelector('input')
            .addEventListener('blur', (e) =>
              this.inputHandler.handleDominoInput(
                e.target,
                dominoGrid,
                this.domGrid,
                message,
                finishSolvingBtn,
                i,
                j
              )
            );
        }
      }
    }
  }

  getNewBoard(dominoGrid) {
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    for (let i = 0; i < dominoGrid.size; i += 1) {
      for (let j = 0; j < dominoGrid.size; j += 1) {
        const { value } = this.domGrid[i][j].querySelector('input');
        if (value.length !== 0) {
          board[i][j] = new CellValue(+value, i, j);
        }
      }
    }
    return new DominoGrid(9, board);
  }
}
