import CellValue from './CellValue';
import Domino from './Domino';
import DominoGrid from './DominoGrid';

export default class UI {
  constructor(board) {
    this.board = board;
    this.domGrid = [];

    const domTD = [...document.querySelectorAll('td')];
    for (let i = 0; i < domTD.length; i += 9) {
      this.domGrid.push(domTD.slice(i, i + 10));
    }

    this.displayBoard();
  }

  clearBoard() {
    for (let i = 0; i < this.board.size; i += 1) {
      for (let j = 0; j < this.board.size; j += 1) {
        this.domGrid[i][j].innerText = '';
        this.domGrid[i][j].className = '';
      }
    }
  }

  displayBoard() {
    for (let i = 0; i < this.board.size; i += 1) {
      for (let j = 0; j < this.board.size; j += 1) {
        if (this.board.board[i][j] instanceof CellValue) {
          this.domGrid[i][j].innerText = this.board.board[i][j].value;
          this.domGrid[i][j].classList.add('number');
        } else if (this.board.board[i][j] instanceof Domino) {
          this.domGrid[i][j].innerText = this.board.board[i][j].getValue(i, j);
          this.domGrid[i][j].classList.add('domino');
        } else {
          this.domGrid[i][j].innerText = '';
        }
      }
    }
  }

  addNewBoard() {
    for (let i = 0; i < this.board.size; i += 1) {
      for (let j = 0; j < this.board.size; j += 1) {
        this.domGrid[i][j].innerHTML = `<input type="text" maxlength="2" />`;
        this.domGrid[i][j]
          .querySelector('input')
          .addEventListener('blur', (e) => {
            const enteredValue = e.target.value.trim();
            if (
              enteredValue.length > 0 &&
              +enteredValue > 0 &&
              +enteredValue < 23
            ) {
              e.target.classList.add('number');
            } else {
              e.target.value = '';
              e.target.classList = '';
            }
          });
      }
    }
  }

  getNewBoard() {
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    for (let i = 0; i < this.board.size; i += 1) {
      for (let j = 0; j < this.board.size; j += 1) {
        const { value } = this.domGrid[i][j].querySelector('input');
        if (value.length !== 0) {
          board[i][j] = new CellValue(+value, i, j);
        }
      }
    }
    return new DominoGrid(9, board);
  }
}
