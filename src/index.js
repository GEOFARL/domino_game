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
import BoardEventHandler from './BoardEventHandlers';

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

const boardEventHandler = new BoardEventHandler(ui, currentBoard, boards);
boardEventHandler.init();

const addBoardBtn = document.getElementById('add-board');
const finishSolvingBtn = document.getElementById('finish-solving');
const solveBoardExitBtn = document.getElementById('solve-board-exit');
const enterNewBoardBtn = document.getElementById('enter-new-board');
const solveAIBtn = document.getElementById('solve-ai');
const solveYourselfBtn = document.getElementById('solve-yourself');
const removeBoardBtn = document.getElementById('remove-current-board');
const closeModalBtn = document.querySelector('.modal__header svg');
const closeModalInfoBtn = document.querySelector('.modal__info svg');

closeModalBtn.addEventListener('click', () => {
  ui.hideModal('error');
});

closeModalInfoBtn.addEventListener('click', () => {
  ui.hideModal('info');
});

solveBoardExitBtn.addEventListener('click', () => {
  ui.hideButtons('solveBoard');
  ui.showButtons('main');
  console.log(currentBoard);
  const dominoGrid = copyDominoGrid(currentBoard);
  console.log(ui.dominoGrid);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
});

addBoardBtn.addEventListener('click', () => {
  console.log(boards);
  let newBoard;

  if (boardEventHandler.getGeneratedBoard()) {
    newBoard = boardEventHandler.getGeneratedBoard();
    boardEventHandler.setGeneratedBoard(null);
  } else {
    newBoard = ui.getNewBoard(currentBoard);
  }
  boards.push(newBoard);
  localStorageManager.saveBoards(boards);
  boards = localStorageManager.getBoards();

  ui.hideButtons('addBoard');
  ui.showButtons('main');

  ui.addSelectOption(boards.length - 1);

  console.log(boards);
  currentBoard = boards[boards.length - 1];
  const dominoGrid = copyDominoGrid(currentBoard);
  boardEventHandler.setCurrentBoard(dominoGrid);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
  ui.switchSelectedBoard(`${boards.length - 1}`);
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

removeBoardBtn.addEventListener('click', () => {
  const index = boards.findIndex((val) => val === currentBoard);
  boards.splice(index, 1);
  ui.removeBoardOption(boards);
  localStorageManager.saveBoards(boards);
  boards = localStorageManager.getBoards();
  currentBoard = boards[boards.length - 1];
  ui.switchSelectedBoard(boards.length - 1);
  const dominoGrid = copyDominoGrid(currentBoard);
  boardEventHandler.setCurrentBoard(dominoGrid);
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
    const solutions = copyDominoGrid(currentBoard).findSolution();
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
