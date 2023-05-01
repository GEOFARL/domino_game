import './template.html';
import './styles.css';

import initialBoards from './initialBoards';
import UI from './UI';
import CellValue from './CellValue';
import DominoGrid from './DominoGrid';

const addOption = (index) => {
  const option = document.createElement('option');
  option.value = index;
  option.innerText = `Board №${index + 1}`;
  boardSelectEl.appendChild(option);
};

const convertToSimple = (boards) => {
  const simpleBoards = [];
  boards.forEach((board) => {
    const justBoard = board.board;
    for (let r = 0; r < board.size; r += 1) {
      for (let c = 0; c < board.size; c += 1) {
        if (typeof board.board[r][c] === 'object') {
          justBoard[r][c] = board.board[r][c].value;
        }
      }
    }
    simpleBoards.push(justBoard);
  });
  return simpleBoards;
};

const convertOutOfSimple = (boards) => {
  const newBoards = [];
  boards.forEach((board) => {
    const newBoard = board;
    for (let r = 0; r < board.length; r += 1) {
      for (let c = 0; c < board.length; c += 1) {
        if (board[r][c] !== 0) {
          newBoard[r][c] = new CellValue(board[r][c], r, c);
        }
      }
    }
    const dominoGrid = new DominoGrid(9, newBoard);
    newBoards.push(dominoGrid);
  });
  return newBoards;
};

let boards = initialBoards;
let currentBoard = boards[0];
const ui = new UI(currentBoard);

const STORAGE_KEY = 'SAVED_BOARDS';
if (localStorage.getItem(STORAGE_KEY)) {
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  console.log(boards);
} else {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convertToSimple(boards)));
}

const firstSection = document.querySelector('.first-section');
const addBoardBtn = document.getElementById('add-board');
const addBoardExit = document.getElementById('add-board-exit');
const addNewBoardBtn = document.getElementById('add-new-board');
const boardSelectEl = document.getElementById('standard-select');
const solveBtn = document.getElementById('solve');
const removeBoardBtn = document.getElementById('remove-current-board');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.modal__header svg');

closeModalBtn.addEventListener('click', () => {
  overlay.classList.add('hide');
  modal.classList.add('hide');
});

addBoardExit.addEventListener('click', () => {
  addBoardBtn.classList.add('hide');
  addBoardExit.classList.add('hide');
  firstSection.classList.remove('hide');
  addNewBoardBtn.classList.remove('hide');
  removeBoardBtn.classList.remove('hide');

  ui.clearBoard();
  ui.displayBoard();
});

addBoardBtn.addEventListener('click', () => {
  console.log(boards);
  const newBoard = ui.getNewBoard();
  boards.push(newBoard);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convertToSimple(boards)));
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORAGE_KEY)));

  addBoardBtn.classList.add('hide');
  addBoardExit.classList.add('hide');
  firstSection.classList.remove('hide');
  addNewBoardBtn.classList.remove('hide');
  removeBoardBtn.classList.remove('hide');

  addOption(boards.length - 1);

  console.log(boards);
  currentBoard = boards[boards.length - 1];
  ui.board = currentBoard;
  ui.clearBoard();
  ui.displayBoard();
  boardSelectEl.value = `${boards.length - 1}`;
});

removeBoardBtn.addEventListener('click', () => {
  const index = boards.findIndex((val) => val === currentBoard);
  boards.splice(index, 1);
  const selectOptions = [...boardSelectEl.children];
  selectOptions[index].remove();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convertToSimple(boards)));
  boards = convertOutOfSimple(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  [currentBoard] = boards;
  ui.board = currentBoard;
  ui.clearBoard();
  ui.displayBoard();
});

addNewBoardBtn.addEventListener('click', (e) => {
  firstSection.classList.add('hide');
  ui.addNewBoard();
  addBoardBtn.classList.remove('hide');
  addBoardExit.classList.remove('hide');
  e.target.classList.add('hide');
  removeBoardBtn.classList.add('hide');
});

boards.forEach((board, index) => addOption(index));

boardSelectEl.addEventListener('change', (e) => {
  currentBoard = boards[e.target.value];
  console.log(currentBoard);
  ui.board = currentBoard;
  ui.clearBoard();
  ui.displayBoard();
});

solveBtn.addEventListener('click', () => {
  setTimeout(() => {
    const solutions = currentBoard.findAllSolutions();
    console.log(solutions);

    try {
      [ui.board] = solutions;
      ui.displayBoard();
    } catch (err) {
      overlay.classList.remove('hide');
      modal.classList.remove('hide');
    }
  }, 300);
});

// console.log(board1);
console.log(ui);
