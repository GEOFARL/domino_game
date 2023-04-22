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

  displayBoard() {
    for (let i = 0; i < this.board.size; i += 1) {
      for (let j = 0; j < this.board.size; j += 1) {
        if (this.board.board[i][j] !== 0) {
          this.domGrid[i][j].innerText = this.board.board[i][j].value;
          this.domGrid[i][j].classList.add('number');
        } else {
          this.domGrid[i][j].innerText = '';
        }
      }
    }
  }
}
