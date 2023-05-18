import UI from '../view/UI';
import { startConfetti, stopConfetti } from '../helpers/confetti';
import { convertToSimple } from '../helpers/conversionFunc';
import copyDominoGrid from '../helpers/copyFunc';

export default class SolveBoardEventHandler {
  constructor(ui, solveYourselfBoard, currentBoard, boardEventHandler) {
    this.ui = ui;
    this.solveYourselfBoard = solveYourselfBoard;
    this.currentBoard = currentBoard;
    this.boardEventHandler = boardEventHandler;

    this.finishSolvingBtn = document.getElementById('finish-solving');
    this.solveBoardExitBtn = document.getElementById('solve-board-exit');
    this.solveAIBtn = document.getElementById('solve-ai');
    this.solveYourselfBtn = document.getElementById('solve-yourself');
  }

  init() {
    this.handleFinishSolving = this.handleFinishSolving.bind(this);
    this.handleSolveBoardExit = this.handleSolveBoardExit.bind(this);
    this.handleSolveAI = this.handleSolveAI.bind(this);
    this.handleSolveYourself = this.handleSolveYourself.bind(this);

    this.finishSolvingBtn.addEventListener('click', this.handleFinishSolving);
    this.solveBoardExitBtn.addEventListener('click', this.handleSolveBoardExit);
    this.solveAIBtn.addEventListener('click', this.handleSolveAI);
    this.solveYourselfBtn.addEventListener('click', this.handleSolveYourself);
  }

  handleFinishSolving() {
    this.ui.hideButtons('solveBoard');
    this.ui.showButtons('main');
    this.ui.hideMessage();
    if (this.solveYourselfBoard.validateSolution()) {
      this.ui.showModal('info');
      UI.disableAllButtons();
      startConfetti();
      stopConfetti();
      setTimeout(() => UI.enableAllButtons(), 7000);
      setTimeout(() => this.ui.showButtons('clearBoard'), 1000);
      if (window.dominoAPI) {
        window.dominoAPI.saveSolution(
          ...convertToSimple([copyDominoGrid(this.solveYourselfBoard)])
        );
      }
    } else {
      this.ui.showMessage('Your solution is incorrect');
      this.ui.showButtons('clearBoard');
      setTimeout(() => {
        this.ui.hideMessage();
      }, 3500);
    }
    const dominoGrid = copyDominoGrid(this.solveYourselfBoard);
    this.ui.clearBoard(dominoGrid);
    this.ui.displayBoard(dominoGrid);
  }

  handleSolveBoardExit() {
    this.ui.hideButtons('solveBoard');
    this.ui.showButtons('main');
    console.log(this.currentBoard);
    const dominoGrid = copyDominoGrid(this.currentBoard);
    console.log(this.ui.dominoGrid);
    this.ui.clearBoard(dominoGrid);
    this.ui.displayBoard(dominoGrid);
  }

  handleSolveAI() {
    this.ui.showMessage('AI is currently working on the problem...');
    setTimeout(() => {
      console.log('current', this.boardEventHandler.getCurrentBoard());
      const solutions = copyDominoGrid(
        this.boardEventHandler.getCurrentBoard()
      ).findSolution();
      console.log(solutions);

      try {
        const dominoGrid = copyDominoGrid(solutions[0]);
        this.ui.clearBoard(dominoGrid);
        this.ui.displayBoard(dominoGrid);
        if (solutions.length !== 0) {
          UI.disableAllButtons();
          startConfetti();
          stopConfetti();
          setTimeout(() => UI.enableAllButtons(), 7000);
          setTimeout(() => this.ui.showButtons('clearBoard'), 1000);

          if (window.dominoAPI) {
            window.dominoAPI.saveSolution(...convertToSimple(solutions));
          }
        }
      } catch (err) {
        console.log(err);
        this.ui.showModal('error');
      }
      this.ui.hideMessage();
    }, 300);
  }

  handleSolveYourself() {
    this.ui.hideButtons('main');
    this.solveYourselfBoard = copyDominoGrid(this.currentBoard);
    this.ui.solveYourself(this.solveYourselfBoard);
    this.ui.showButtons('solveBoard');
  }

  getSolveYourselfBoard() {
    return this.solveYourselfBoard;
  }

  setSolveYourselfBoard(newBoard) {
    this.solveYourselfBoard = newBoard;
  }

  getCurrentBoard() {
    return this.currentBoard;
  }

  setCurrentBoard(newBoard) {
    this.currentBoard = newBoard;
  }
}
