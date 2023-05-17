import BoardManager from './BoardManager';
import GridRenderer from './GridRenderer';

export default class UI {
  constructor(
    dominoGrid,
    menu,
    addBoardSection,
    solveBoardSection,
    messageElement
  ) {
    this.dominoGrid = dominoGrid;
    this.domGrid = [];

    this.boardManager = new BoardManager(this.domGrid);

    this.menuSection = menu;
    this.addBoardSection = addBoardSection;
    this.solveBoardSection = solveBoardSection;
    this.message = messageElement;
    this.finishSolvingBtn = document.getElementById('finish-solving');

    const domTD = [...document.querySelectorAll('td')];
    for (let i = 0; i < domTD.length; i += 9) {
      this.domGrid.push(domTD.slice(i, i + 10));
    }

    this.displayBoard();
  }

  clearBoard() {
    GridRenderer.clearBoard(this.domGrid, this.dominoGrid);
  }

  displayBoard() {
    GridRenderer.displayBoard(this.dominoGrid, this.domGrid);
  }

  addNewBoard() {
    this.boardManager.addNewBoard(this.dominoGrid);
  }

  solveYourself() {
    this.boardManager.solveYourself(
      this.dominoGrid,
      this.message,
      this.finishSolvingBtn
    );
  }

  getNewBoard() {
    return this.boardManager.getNewBoard(this.dominoGrid);
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
}
