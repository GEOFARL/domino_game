import './template.html';
import './styles.css';

import initialBoards from './initialBoards';
import UI from './UI';
import Section from './Section';
import DominoGrid from './DominoGrid';
import copyDominoGrid from './copyFunc';
import { startConfetti, stopConfetti } from './confetti';
import { convertOutOfSimple, convertToSimple } from './conversionFunc';
import Message from './Message';
import BoardSelect from './BoardSelect';
import Modal from './Modal';
import ThemeManager from './ThemeManager';
import LocalStorageManager from './LocalStorageManager';

let boards;
let currentBoard;
let solveYourselfBoard;
let generatedBoard = null;
const STORE_KEY = 'SAVED_BOARDS';

const localStorageManager = new LocalStorageManager(STORE_KEY);

if (localStorageManager.existBoards()) {
  boards = localStorageManager.getBoards();
  [currentBoard] = boards;
} else {
  localStorageManager.saveBoards(initialBoards);
  [currentBoard] = initialBoards;
}

// if (localStorage.getItem(STORE_KEY)) {
//   boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));
//   [currentBoard] = boards;
// } else {
//   localStorage.setItem(
//     STORE_KEY,
//     JSON.stringify(convertToSimple(initialBoards))
//   );
//   [currentBoard] = initialBoards;
// }

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

const addBoardBtn = document.getElementById('add-board');
const addBoardExitBtn = document.getElementById('add-board-exit');
const finishSolvingBtn = document.getElementById('finish-solving');
const solveBoardExitBtn = document.getElementById('solve-board-exit');
const enterNewBoardBtn = document.getElementById('enter-new-board');
const solveAIBtn = document.getElementById('solve-ai');
const solveYourselfBtn = document.getElementById('solve-yourself');
const removeBoardBtn = document.getElementById('remove-current-board');
const closeModalBtn = document.querySelector('.modal__header svg');
const closeModalInfoBtn = document.querySelector('.modal__info svg');
const generateBtn = document.getElementById('generate');
const clearBoardBtn = document.getElementById('clear-board');

clearBoardBtn.addEventListener('click', () => {
  const dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
  clearBoardBtn.classList.add('hide');
});

generateBtn.addEventListener('click', () => {
  ui.showMessage('Generating a board...');

  setTimeout(() => {
    generatedBoard = new DominoGrid(9);
    ui.hideMainButtons();
    ui.showAddBoardButtons();
    const dominoGrid = copyDominoGrid(generatedBoard);
    ui.clearBoard(dominoGrid);
    ui.displayBoard(dominoGrid);

    ui.hideMessage();
  }, 100);
});

closeModalBtn.addEventListener('click', () => {
  ui.hideModal('error');
});

closeModalInfoBtn.addEventListener('click', () => {
  ui.hideModal('info');
});

addBoardExitBtn.addEventListener('click', () => {
  ui.hideAddBoardButtons();
  ui.showMainButtons();

  if (generatedBoard) {
    generatedBoard = null;
    const dominoGrid = copyDominoGrid(boards[0]);
    ui.clearBoard(dominoGrid);
    ui.displayBoard(dominoGrid);
    return;
  }

  const dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
});

solveBoardExitBtn.addEventListener('click', () => {
  ui.hideSolveBoardButtons();
  ui.showMainButtons();
  console.log(currentBoard);
  const dominoGrid = copyDominoGrid(currentBoard);
  console.log(ui.dominoGrid);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
});

addBoardBtn.addEventListener('click', () => {
  console.log(boards);
  let newBoard;
  if (generatedBoard) {
    newBoard = generatedBoard;
    generatedBoard = null;
  } else {
    newBoard = ui.getNewBoard(currentBoard);
  }
  boards.push(newBoard);
  // localStorage.setItem(STORE_KEY, JSON.stringify(convertToSimple(boards)));
  localStorageManager.saveBoards(boards);
  // boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));
  boards = localStorageManager.getBoards();

  ui.hideAddBoardButtons();
  ui.showMainButtons();

  ui.addSelectOption(boards.length - 1);

  console.log(boards);
  currentBoard = boards[boards.length - 1];
  const dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
  ui.switchSelectedBoard(`${boards.length - 1}`);
});

finishSolvingBtn.addEventListener('click', () => {
  ui.hideSolveBoardButtons();
  ui.showMainButtons();
  ui.hideMessage();
  if (solveYourselfBoard.validateSolution()) {
    ui.showModal('info');
    UI.disableAllButtons();
    startConfetti();
    stopConfetti();
    setTimeout(() => UI.enableAllButtons(), 7000);
    setTimeout(() => clearBoardBtn.classList.remove('hide'), 1000);
    if (window.dominoAPI) {
      window.dominoAPI.saveSolution(
        ...convertToSimple([copyDominoGrid(solveYourselfBoard)])
      );
    }
  } else {
    ui.showMessage('Your solution is incorrect');
    clearBoardBtn.classList.remove('hide');
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
  // localStorage.setItem(STORE_KEY, JSON.stringify(convertToSimple(boards)));
  localStorageManager.saveBoards(boards);
  // boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));
  boards = localStorageManager.getBoards();
  currentBoard = boards[boards.length - 1];
  ui.switchSelectedBoard(boards.length - 1);
  const dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
});

enterNewBoardBtn.addEventListener('click', () => {
  ui.hideMainButtons();
  ui.addNewBoard(currentBoard);
  ui.showAddBoardButtons();
});

solveYourselfBtn.addEventListener('click', () => {
  ui.hideMainButtons();
  solveYourselfBoard = copyDominoGrid(currentBoard);
  ui.solveYourself(solveYourselfBoard);
  ui.showSolveBoardButtons();
});

boards.forEach((board, index) => ui.addSelectOption(index));

ui.boardSelect.select.addEventListener('change', (e) => {
  currentBoard = boards[e.target.value];
  console.log(currentBoard);
  const dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
  clearBoardBtn.classList.add('hide');
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
        setTimeout(() => clearBoardBtn.classList.remove('hide'), 1000);

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
