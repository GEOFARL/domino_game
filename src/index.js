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

let boards;
let currentBoard;
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

const ui = new UI(
  currentBoard,
  menuSection,
  addBoardSection,
  solveBoardSection,
  messageElement
);

const addBoardBtn = document.getElementById('add-board');
const addBoardExitBtn = document.getElementById('add-board-exit');
const finishSolvingBtn = document.getElementById('finish-solving');
const solveBoardExitBtn = document.getElementById('solve-board-exit');
const enterNewBoardBtn = document.getElementById('enter-new-board');
const boardSelectEl = document.getElementById('standard-select');
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

let generatedBoard = null;

const addOption = (index) => {
  const option = document.createElement('option');
  option.value = index;
  option.innerText = `Board №${index + 1}`;
  boardSelectEl.appendChild(option);
};

clearBoardBtn.addEventListener('click', () => {
  ui.dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard();
  ui.displayBoard();
  clearBoardBtn.classList.add('hide');
});

generateBtn.addEventListener('click', () => {
  ui.showMessage('Generating a board...');

  setTimeout(() => {
    generatedBoard = new DominoGrid(9);
    ui.hideMainButtons();
    ui.showAddBoardButtons();
    ui.dominoGrid = copyDominoGrid(generatedBoard);
    ui.clearBoard();
    ui.displayBoard();

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
    ui.dominoGrid = copyDominoGrid(boards[0]);
    ui.clearBoard();
    ui.displayBoard();
    return;
  }

  ui.clearBoard();
  ui.displayBoard();
});

solveBoardExitBtn.addEventListener('click', () => {
  ui.hideSolveBoardButtons();
  ui.showMainButtons();
  console.log(currentBoard);
  ui.dominoGrid = copyDominoGrid(currentBoard);
  console.log(ui.dominoGrid);
  ui.clearBoard();
  ui.displayBoard();
});

addBoardBtn.addEventListener('click', () => {
  console.log(boards);
  let newBoard;
  if (generatedBoard) {
    newBoard = generatedBoard;
    generatedBoard = null;
  } else {
    newBoard = ui.getNewBoard();
  }
  boards.push(newBoard);
  localStorage.setItem(STORE_KEY, JSON.stringify(convertToSimple(boards)));
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));

  ui.hideAddBoardButtons();
  ui.showMainButtons();

  addOption(boards.length - 1);

  console.log(boards);
  currentBoard = boards[boards.length - 1];
  ui.dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard();
  ui.displayBoard();
  boardSelectEl.value = `${boards.length - 1}`;
});

finishSolvingBtn.addEventListener('click', () => {
  ui.hideSolveBoardButtons();
  ui.showMainButtons();
  ui.hideMessage();
  if (ui.dominoGrid.validateSolution()) {
    overlay.classList.remove('hide');
    modalInfo.classList.remove('hide');
    UI.disableAllButtons();
    startConfetti();
    stopConfetti();
    setTimeout(() => UI.enableAllButtons(), 7000);
    setTimeout(() => clearBoardBtn.classList.remove('hide'), 1000);
    if (window.dominoAPI) {
      window.dominoAPI.saveSolution(
        ...convertToSimple([copyDominoGrid(ui.dominoGrid)])
      );
    }
    // ui.showMessage('Your solution is correct');
  } else {
    ui.showMessage('Your solution is incorrect');
    clearBoardBtn.classList.remove('hide');
    setTimeout(() => {
      ui.hideMessage();
    }, 3500);
  }
  ui.clearBoard();
  ui.displayBoard();
});

removeBoardBtn.addEventListener('click', () => {
  const index = boards.findIndex((val) => val === currentBoard);
  boards.splice(index, 1);
  const selectOptions = [...boardSelectEl.children];
  selectOptions.forEach((option) => option.remove());
  boards.forEach((board, indexx) => addOption(indexx));
  localStorage.setItem(STORE_KEY, JSON.stringify(convertToSimple(boards)));
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORE_KEY)));
  currentBoard = boards[boards.length - 1];
  boardSelectEl.value = boards.length - 1;
  ui.dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard();
  ui.displayBoard();
});

enterNewBoardBtn.addEventListener('click', () => {
  ui.hideMainButtons();
  ui.addNewBoard();
  ui.showAddBoardButtons();
});

solveYourselfBtn.addEventListener('click', () => {
  ui.hideMainButtons();
  ui.dominoGrid = copyDominoGrid(currentBoard);
  ui.solveYourself();
  ui.showSolveBoardButtons();
});

boards.forEach((board, index) => addOption(index));

boardSelectEl.addEventListener('change', (e) => {
  currentBoard = boards[e.target.value];
  console.log(currentBoard);
  ui.dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard();
  ui.displayBoard();
  clearBoardBtn.classList.add('hide');
});

solveAIBtn.addEventListener('click', () => {
  ui.showMessage('AI is currently working on the problem...');
  setTimeout(() => {
    const solutions = copyDominoGrid(currentBoard).findSolution();
    console.log(solutions);

    try {
      [ui.dominoGrid] = solutions;
      ui.clearBoard();
      ui.displayBoard();
      ui.dominoGrid = copyDominoGrid(currentBoard);
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
