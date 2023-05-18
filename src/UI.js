import BoardManager from './BoardManager';
import GridRenderer from './GridRenderer';

export default class UI {
  constructor(
    menu,
    addBoardSection,
    solveBoardSection,
    messageElement,
    boardSelect,
    modalError,
    modalInfo
  ) {
    this.domGrid = [];

    this.boardManager = new BoardManager(this.domGrid);

    this.menuSection = menu;
    this.addBoardSection = addBoardSection;
    this.solveBoardSection = solveBoardSection;
    this.message = messageElement;
    this.boardSelect = boardSelect;
    this.modalError = modalError;
    this.modalInfo = modalInfo;
    this.finishSolvingBtn = document.getElementById('finish-solving');

    const domTD = [...document.querySelectorAll('td')];
    for (let i = 0; i < domTD.length; i += 9) {
      this.domGrid.push(domTD.slice(i, i + 9));
    }
  }

  showModal(type) {
    switch (type) {
      case 'info': {
        this.modalInfo.show();
        break;
      }
      case 'error': {
        this.modalError.show();
        break;
      }
      default:
        console.log('nothing');
    }
  }

  hideModal(type) {
    switch (type) {
      case 'info': {
        this.modalInfo.hide();
        break;
      }
      case 'error': {
        this.modalError.hide();
        break;
      }
      default:
        console.log('nothing');
    }
  }

  removeBoardOption(boards) {
    this.boardSelect.removeOption(boards);
  }

  switchSelectedBoard(value) {
    this.boardSelect.changeValue(value);
  }

  addSelectOption(value) {
    this.boardSelect.addOption(value);
  }

  clearBoard(dominoGrid) {
    GridRenderer.clearBoard(this.domGrid, dominoGrid);
  }

  displayBoard(dominoGrid) {
    GridRenderer.displayBoard(dominoGrid, this.domGrid);
  }

  addNewBoard(dominoGrid) {
    this.boardManager.addNewBoard(dominoGrid);
  }

  solveYourself(dominoGrid) {
    this.boardManager.solveYourself(
      dominoGrid,
      this.message,
      this.finishSolvingBtn
    );
  }

  getNewBoard(dominoGrid) {
    return this.boardManager.getNewBoard(dominoGrid);
  }

  hideMainButtons() {
    this.menuSection.hide();
  }

  showMainButtons() {
    this.menuSection.show();
  }

  showAddBoardButtons() {
    this.addBoardSection.show();
  }

  hideAddBoardButtons() {
    this.addBoardSection.hide();
  }

  showSolveBoardButtons() {
    this.solveBoardSection.show();
    this.finishSolvingBtn.classList.add('btn--disabled');
    this.finishSolvingBtn.disabled = true;
  }

  hideSolveBoardButtons() {
    this.solveBoardSection.hide();
  }

  showMessage(text) {
    this.message.show(text);
  }

  hideMessage() {
    this.message.hide();
  }

  static disableAllButtons() {
    [...document.querySelectorAll('button')].forEach((button) => {
      button.disabled = true;
    });
  }

  static enableAllButtons() {
    [...document.querySelectorAll('button')].forEach((button) => {
      button.disabled = false;
    });
  }
}
