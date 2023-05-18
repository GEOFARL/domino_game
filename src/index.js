import './template.html';
import './styles.css';

import initialBoards from './initialBoards';
import UI from './UI';
import Section from './Section';
import copyDominoGrid from './copyFunc';
import { startConfetti, stopConfetti } from './confetti';
import { convertToSimple } from './conversionFunc';
import Message from './Message';
import BoardSelect from './BoardSelect';
import Modal from './Modal';
import ThemeManager from './ThemeManager';
import LocalStorageManager from './LocalStorageManager';
import BoardEventHandler from './BoardEventHandler';
import ModalEventHandlers from './ModalEventHandler';

let boards;
let currentBoard;
let solveYourselfBoard;
const STORE_KEY = 'SAVED_BOARDS';

const localStorageManager = new LocalStorageManager(STORE_KEY);

if (localStorageManager.existBoards()) {
  boards = localStorageManager.getBoards();
  [currentBoard] = boards;
} else {
  localStorageManager.saveBoards(initialBoards);
  [currentBoard] = initialBoards;
}

const themeManager = new ThemeManager();
themeManager.init();
const menuSection = new Section(document.querySelector('.menu-section'));
const addBoardSection = new Section(document.querySelector('.add-board'));
const solveBoardSection = new Section(document.querySelector('.solve-board'));
const messageElement = new Message(document.querySelector('.message'));
const boardSelect = new BoardSelect(document.getElementById('standard-select'));
const modalError = new Modal(
  document.querySelector('.modal'),
  document.querySelector('.overlay')
);
const modalInfo = new Modal(
  document.querySelector('.modal__info'),
  document.querySelector('.overlay')
);

const ui = new UI(
  menuSection,
  addBoardSection,
  solveBoardSection,
  messageElement,
  boardSelect,
  modalError,
  modalInfo
);
ui.displayBoard(currentBoard);

const boardEventHandler = new BoardEventHandler(
  ui,
  currentBoard,
  boards,
  localStorageManager
);
boardEventHandler.init();
const modalEventHandler = new ModalEventHandlers(ui);
modalEventHandler.init();

const finishSolvingBtn = document.getElementById('finish-solving');
const solveBoardExitBtn = document.getElementById('solve-board-exit');
const enterNewBoardBtn = document.getElementById('enter-new-board');
const solveAIBtn = document.getElementById('solve-ai');
const solveYourselfBtn = document.getElementById('solve-yourself');

solveBoardExitBtn.addEventListener('click', () => {
  ui.hideButtons('solveBoard');
  ui.showButtons('main');
  console.log(currentBoard);
  const dominoGrid = copyDominoGrid(currentBoard);
  console.log(ui.dominoGrid);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
});

finishSolvingBtn.addEventListener('click', () => {
  ui.hideButtons('solveBoard');
  ui.showButtons('main');
  ui.hideMessage();
  if (solveYourselfBoard.validateSolution()) {
    ui.showModal('info');
    UI.disableAllButtons();
    startConfetti();
    stopConfetti();
    setTimeout(() => UI.enableAllButtons(), 7000);
    setTimeout(() => ui.showButtons('clearBoard'), 1000);
    if (window.dominoAPI) {
      window.dominoAPI.saveSolution(
        ...convertToSimple([copyDominoGrid(solveYourselfBoard)])
      );
    }
  } else {
    ui.showMessage('Your solution is incorrect');
    ui.showButtons('clearBoard');
    setTimeout(() => {
      ui.hideMessage();
    }, 3500);
  }
  const dominoGrid = copyDominoGrid(solveYourselfBoard);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
});

enterNewBoardBtn.addEventListener('click', () => {
  ui.hideButtons('main');
  ui.addNewBoard(currentBoard);
  ui.showButtons('addBoard');
});

solveYourselfBtn.addEventListener('click', () => {
  ui.hideButtons('main');
  solveYourselfBoard = copyDominoGrid(currentBoard);
  ui.solveYourself(solveYourselfBoard);
  ui.showButtons('solveBoard');
});

boards.forEach((board, index) => ui.addSelectOption(index));

ui.boardSelect.select.addEventListener('change', (e) => {
  currentBoard = boards[e.target.value];
  console.log(currentBoard);
  const dominoGrid = copyDominoGrid(currentBoard);
  boardEventHandler.setCurrentBoard(dominoGrid);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
  ui.hideButtons('clearBoard');
});

solveAIBtn.addEventListener('click', () => {
  ui.showMessage('AI is currently working on the problem...');
  setTimeout(() => {
    console.log('current', boardEventHandler.getCurrentBoard());
    const solutions = copyDominoGrid(
      boardEventHandler.getCurrentBoard()
    ).findSolution();
    console.log(solutions);

    try {
      const dominoGrid = copyDominoGrid(solutions[0]);
      ui.clearBoard(dominoGrid);
      ui.displayBoard(dominoGrid);
      if (solutions.length !== 0) {
        UI.disableAllButtons();
        startConfetti();
        stopConfetti();
        setTimeout(() => UI.enableAllButtons(), 7000);
        setTimeout(() => ui.showButtons('clearBoard'), 1000);

        if (window.dominoAPI) {
          window.dominoAPI.saveSolution(...convertToSimple(solutions));
        }
      }
    } catch (err) {
      console.log(err);
      ui.showModal('error');
    }
    ui.hideMessage();
  }, 300);
});
