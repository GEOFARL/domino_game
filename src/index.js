import './template.html';
import './styles.css';

import initialBoards from './initialBoards';
import UI from './UI';
import DominoGrid from './DominoGrid';
import copyDominoGrid from './copyFunc';
import './theme';
import { convertOutOfSimple, convertToSimple } from './conversionFunc';

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

const ui = new UI(currentBoard);

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
const generateBtn = document.getElementById('generate');

let generatedBoard = null;

const addOption = (index) => {
  const option = document.createElement('option');
  option.value = index;
  option.innerText = `Board №${index + 1}`;
  boardSelectEl.appendChild(option);
};

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
  ui.dominoGrid = copyDominoGrid(currentBoard);
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
  ui.dominoGrid = copyDominoGrid(currentBoard);
  ui.clearBoard();
  ui.displayBoard();
});

removeBoardBtn.addEventListener('click', () => {
  const index = boards.findIndex((val) => val === currentBoard);
  boards.splice(index, 1);
  const selectOptions = [...boardSelectEl.children];
  selectOptions[index].remove();
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
});

solveAIBtn.addEventListener('click', () => {
  ui.showMessage('AI is currently working on the problem...');
  setTimeout(() => {
    const solutions = copyDominoGrid(currentBoard).findAllSolutions();
    console.log(solutions);

    try {
      [ui.dominoGrid] = solutions;
      ui.displayBoard();
      ui.dominoGrid = copyDominoGrid(currentBoard);
      if (window.dominoAPI) {
        console.log('here');
        window.dominoAPI.saveSolution(...convertToSimple(solutions));
      }
    } catch (err) {
      console.log(err);
      overlay.classList.remove('hide');
      modal.classList.remove('hide');
    }
    ui.hideMessage();
  }, 300);
});
