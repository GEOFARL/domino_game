import DominoGrid from '../gameLogic/DominoGrid';
import { convertOutOfSimple } from '../helpers/conversionFunc';
import copyDominoGrid from '../helpers/copyFunc';

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
    this.addBoardBtn = document.getElementById('add-board');
    this.enterNewBoardBtn = document.getElementById('enter-new-board');
    this.loadNewBoardForm = document.querySelector('.load-board-section');
  }

  init() {
    this.handleClearBoard = this.handleClearBoard.bind(this);
    this.handleGenerateBoard = this.handleGenerateBoard.bind(this);
    this.handleAddBoardExit = this.handleAddBoardExit.bind(this);
    this.handleRemoveBoard = this.handleRemoveBoard.bind(this);
    this.handleAddBoard = this.handleAddBoard.bind(this);
    this.handleEnterNewBoard = this.handleEnterNewBoard.bind(this);
    this.handleLoadNewBoard = this.handleLoadNewBoard.bind(this);

    this.clearBoardBtn.addEventListener('click', this.handleClearBoard);
    this.generateBtn.addEventListener('click', this.handleGenerateBoard);
    this.addBoardExitBtn.addEventListener('click', this.handleAddBoardExit);
    this.removeBoardBtn.addEventListener('click', this.handleRemoveBoard);
    this.addBoardBtn.addEventListener('click', this.handleAddBoard);
    this.enterNewBoardBtn.addEventListener('click', this.handleEnterNewBoard);
    this.loadNewBoardForm.addEventListener('submit', this.handleLoadNewBoard);

    this.boards.forEach((board, index) => this.ui.addSelectOption(index));
  }

  async handleLoadNewBoard(e) {
    e.preventDefault();
    const inputEl = this.loadNewBoardForm.querySelector('input');
    const messageEl = this.loadNewBoardForm.querySelector(
      '.message-load-board'
    );
    messageEl.classList.add('hide');
    const enteredValue = inputEl.value;
    if (enteredValue.trim().length > 0) {
      const board = await window.dominoAPI.getBoard(enteredValue);
      if (board === 'Cannot open this file') {
        messageEl.innerHTML = board;
        messageEl.classList.remove('hide');
      } else {
        const [dominoGrid] = convertOutOfSimple([board]);
        this.ui.clearBoard(dominoGrid);
        this.ui.displayBoard(dominoGrid);
        this.ui.showButtons('clearBoard');
      }
      inputEl.value = '';
    }
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

  handleAddBoard() {
    console.log(this.boards);
    let newBoard;

    if (this.getGeneratedBoard()) {
      console.log('generated board');
      newBoard = this.getGeneratedBoard();
      this.setGeneratedBoard(null);
    } else {
      newBoard = this.ui.getNewBoard(this.currentBoard);
    }
    this.boards.push(newBoard);
    this.localStorageManager.saveBoards(this.boards);
    this.boards.splice(
      0,
      this.boards.length,
      ...this.localStorageManager.getBoards()
    );

    this.ui.hideButtons('addBoard');
    this.ui.showButtons('main');

    this.ui.addSelectOption(this.boards.length - 1);

    console.log(this.boards);
    this.currentBoard = this.boards[this.boards.length - 1];
    const dominoGrid = copyDominoGrid(this.currentBoard);
    this.setCurrentBoard(dominoGrid);
    this.ui.clearBoard(dominoGrid);
    this.ui.displayBoard(dominoGrid);
    this.ui.switchSelectedBoard(`${this.boards.length - 1}`);
  }

  handleEnterNewBoard() {
    this.ui.hideButtons('main');
    this.ui.addNewBoard(this.currentBoard);
    this.ui.showButtons('addBoard');
  }

  getCurrentBoard() {
    return this.currentBoard;
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
