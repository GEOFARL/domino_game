import './template.html';
import './styles.css';

import initialBoards from './initialBoards/initialBoards';
import UI from './view/UI';
import Section from './components/Section';
import copyDominoGrid from './helpers/copyFunc';
import Message from './components/Message';
import BoardSelect from './components/BoardSelect';
import Modal from './components/Modal';
import ThemeManager from './view/ThemeManager';
import LocalStorageManager from './data/LocalStorageManager';
import BoardEventHandler from './eventHandlers/BoardEventHandler';
import ModalEventHandlers from './eventHandlers/ModalEventHandler';
import SolveBoardEventHandler from './eventHandlers/SolveBoardEventHandler';

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
const solveBoardEventHandler = new SolveBoardEventHandler(
  ui,
  solveYourselfBoard,
  currentBoard,
  boardEventHandler
);
solveBoardEventHandler.init();

ui.boardSelect.element.addEventListener('change', (e) => {
  currentBoard = boards[e.target.value];
  const dominoGrid = copyDominoGrid(currentBoard);
  boardEventHandler.setCurrentBoard(dominoGrid);
  solveBoardEventHandler.setCurrentBoard(dominoGrid);
  ui.clearBoard(dominoGrid);
  ui.displayBoard(dominoGrid);
  ui.hideButtons('clearBoard');
});
