import DominoGrid from './DominoGrid';
import copyDominoGrid from './copyFunc';

export default class BoardEventHandler {
  constructor(ui, currentBoard, boards, localStorageManager) {
    this.ui = ui;
    this.currentBoard = currentBoard;
    this.generatedBoard = null;
    this.boards = boards;
    this.localStorageManager = localStorageManager;

    this.clearBoardBtn = document.getElementById('clear-board');
    this.generateBtn = document.getElementById('generate');
    this.addBoardExitBtn = document.getElementById('add-board-exit');
    this.removeBoardBtn = document.getElementById('remove-current-board');
  }

  init() {
    this.handleClearBoard = this.handleClearBoard.bind(this);
    this.handleGenerateBoard = this.handleGenerateBoard.bind(this);
    this.handleAddBoardExit = this.handleAddBoardExit.bind(this);
    this.handleRemoveBoard = this.handleRemoveBoard.bind(this);

    this.clearBoardBtn.addEventListener('click', this.handleClearBoard);
    this.generateBtn.addEventListener('click', this.handleGenerateBoard);
    this.addBoardExitBtn.addEventListener('click', this.handleAddBoardExit);
    this.removeBoardBtn.addEventListener('click', this.handleRemoveBoard);
  }

  handleClearBoard() {
    const dominoGrid = copyDominoGrid(this.currentBoard);
    this.ui.clearBoard(dominoGrid);
    this.ui.displayBoard(dominoGrid);
    this.clearBoardBtn.classList.add('hide');
  }

  handleGenerateBoard() {
    this.ui.showMessage('Generating a board...');

    setTimeout(() => {
      this.generatedBoard = new DominoGrid(9);
      this.ui.hideButtons('main');
      this.ui.showButtons('addBoard');
      const dominoGrid = copyDominoGrid(this.generatedBoard);
      this.setCurrentBoard(dominoGrid);
      this.ui.clearBoard(dominoGrid);
      this.ui.displayBoard(dominoGrid);

      this.ui.hideMessage();
    }, 100);
  }

  handleAddBoardExit() {
    this.ui.hideButtons('addBoard');
    this.ui.showButtons('main');

    if (this.getGeneratedBoard()) {
      this.setGeneratedBoard(null);
      const dominoGrid = copyDominoGrid(this.boards[0]);
      this.ui.clearBoard(dominoGrid);
      this.ui.displayBoard(dominoGrid);
      return;
    }

    const dominoGrid = copyDominoGrid(this.currentBoard);
    this.ui.clearBoard(dominoGrid);
    this.ui.displayBoard(dominoGrid);
  }

  handleRemoveBoard() {
    const index = this.boards.findIndex((val) => val === this.currentBoard);
    this.boards.splice(index, 1);
    this.ui.removeBoardOption(this.boards);
    this.localStorageManager.saveBoards(this.boards);
    this.boards.splice(
      0,
      this.boards.length,
      ...this.localStorageManager.getBoards()
    );
    // this.boards = this.localStorageManager.getBoards();
    this.currentBoard = this.boards[this.boards.length - 1];
    this.ui.switchSelectedBoard(this.boards.length - 1);
    const dominoGrid = copyDominoGrid(this.currentBoard);
    this.setCurrentBoard(dominoGrid);
    this.ui.clearBoard(dominoGrid);
    this.ui.displayBoard(dominoGrid);
  }

  setCurrentBoard(newBoard) {
    this.currentBoard = newBoard;
  }

  getGeneratedBoard() {
    return this.generatedBoard;
  }

  setGeneratedBoard(board) {
    this.generatedBoard = board;
  }
}
