import './template.html';
import './styles.css';

import initialBoards from './initialBoards';
import UI from './UI';
import Section from './Section';
import DominoGrid from './DominoGrid';
import copyDominoGrid from './copyFunc';
import './theme';
import { startConfetti, stopConfetti } from './confetti';
import { convertOutOfSimple, convertToSimple } from './conversionFunc';
import Message from './Message';
import BoardSelect from './BoardSelect';

let boards;
let currentBoard;
let solveYourselfBoard;
let generatedBoard = null;
const STORE_KEY = 'SAVED_BOARDS';

if (localStorage.getItem(STORE_KEY)) {
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));
  [currentBoard] = boards;
} else {
  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(convertToSimple(initialBoards))
  );
  [currentBoard] = initialBoards;
}

const menuSection = new Section(document.querySelector('.menu-section'));
const addBoardSection = new Section(document.querySelector('.add-board'));
const solveBoardSection = new Section(document.querySelector('.solve-board'));
const messageElement = new Message(document.querySelector('.message'));
const boardSelect = new BoardSelect(document.getElementById('standard-select'));

const ui = new UI(
  menuSection,
  addBoardSection,
  solveBoardSection,
  messageElement,
  boardSelect
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
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.modal__header svg');
const modalInfo = document.querySelector('.modal__info');
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
  overlay.classList.add('hide');
  modal.classList.add('hide');
});

closeModalInfoBtn.addEventListener('click', () => {
  overlay.classList.add('hide');
  modalInfo.classList.add('hide');
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
  localStorage.setItem(STORE_KEY, JSON.stringify(convertToSimple(boards)));
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));

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
    overlay.classList.remove('hide');
    modalInfo.classList.remove('hide');
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
  localStorage.setItem(STORE_KEY, JSON.stringify(convertToSimple(boards)));
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));
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
      overlay.classList.remove('hide');
      modal.classList.remove('hide');
    }
    ui.hideMessage();
  }, 300);
});
