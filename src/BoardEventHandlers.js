import copyDominoGrid from './copyFunc';

export default class BoardEventHandler {
  constructor(ui, currentBoard) {
    this.ui = ui;
    this.currentBoard = currentBoard;

    this.clearBoardBtn = document.getElementById('clear-board');
  }

  init() {
    this.handleClearBoard = this.handleClearBoard.bind(this);

    this.clearBoardBtn.addEventListener('click', this.handleClearBoard);
  }

  handleClearBoard() {
    const dominoGrid = copyDominoGrid(this.currentBoard);
    this.ui.clearBoard(dominoGrid);
    this.ui.displayBoard(dominoGrid);
    this.clearBoardBtn.classList.add('hide');
  }

  updateBoard(newBoard) {
    this.currentBoard = newBoard;
  }
}
