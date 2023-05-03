import CellValue from './CellValue';
import Domino from './Domino';
import DominoGrid from './DominoGrid';

export default class UI {
  constructor(dominoGrid) {
    this.dominoGrid = dominoGrid;
    this.domGrid = [];

    this.firstSection = document.querySelector('.first-section');
    this.addBoardSection = document.querySelector('.add-board');
    this.solveBoardSection = document.querySelector('.solve-board');
    this.message = document.querySelector('.message');
    this.finishSolvingBtn = document.getElementById('finish-solving');

    this.activeInputs = [];
    this.isStartedPlacingDomino = false;

    const domTD = [...document.querySelectorAll('td')];
    for (let i = 0; i < domTD.length; i += 9) {
      this.domGrid.push(domTD.slice(i, i + 10));
    }

    this.displayBoard();
  }

  clearBoard() {
    for (let i = 0; i < this.dominoGrid.size; i += 1) {
      for (let j = 0; j < this.dominoGrid.size; j += 1) {
        this.domGrid[i][j].innerText = '';
        this.domGrid[i][j].className = '';
      }
    }
  }

  displayBoard() {
    for (let i = 0; i < this.dominoGrid.size; i += 1) {
      for (let j = 0; j < this.dominoGrid.size; j += 1) {
        if (this.dominoGrid.board[i][j] instanceof CellValue) {
          this.domGrid[i][j].innerText = this.dominoGrid.board[i][j].value;
          this.domGrid[i][j].classList.add('number');
        } else if (this.dominoGrid.board[i][j] instanceof Domino) {
          this.domGrid[i][j].innerText = this.dominoGrid.board[i][j].getValue(
            i,
            j
          );
          this.domGrid[i][j].classList.add('domino');
        } else {
          this.domGrid[i][j].innerText = '';
        }
      }
    }
  }

  addNewBoard() {
    for (let i = 0; i < this.dominoGrid.size; i += 1) {
      for (let j = 0; j < this.dominoGrid.size; j += 1) {
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

  solveYourself() {
    for (let i = 0; i < this.dominoGrid.size; i += 1) {
      for (let j = 0; j < this.dominoGrid.size; j += 1) {
        if (!(this.dominoGrid.board[i][j] instanceof CellValue)) {
          this.domGrid[i][j].innerHTML = `<input type="text" maxlength="2" />`;

          this.domGrid[i][j]
            .querySelector('input')
            .addEventListener('blur', (e) => {
              if (e.target.classList.contains('domino')) {
                return;
              }
              const enteredValue = e.target.value.trim();
              if (
                enteredValue.length > 0 &&
                +enteredValue > 0 &&
                +enteredValue < 7
              ) {
                e.target.classList.add('domino');
                if (!this.isStartedPlacingDomino) {
                  this.isStartedPlacingDomino = true;
                  const directions = this.dominoGrid.findDirections(i, j);

                  if (directions.length === 0) {
                    this.isStartedPlacingDomino = false;
                    e.target.classList.remove('domino');
                    e.target.value = '';
                    return;
                  }

                  directions.forEach((direction) => {
                    const [offR, offC] = DominoGrid.offsets[direction];
                    const pos = [i + offR, j + offC];
                    this.activeInputs.push(pos);
                  });
                  this.activeInputs.push([i, j]);
                  this.disableInputs();
                } else if (this.isStartedPlacingDomino) {
                  const [r, c] =
                    this.activeInputs[this.activeInputs.length - 1];
                  const b = +e.target.value;
                  const a = +this.domGrid[r][c].children[0].value;

                  const offR = i - r;
                  const offC = j - c;
                  console.log(offR, offC);

                  let direction = -1;
                  DominoGrid.offsets.some((offset, index) => {
                    const [nOffR, nOffC] = offset;
                    if (offR === nOffR && offC === nOffC) {
                      direction = index;
                      return true;
                    }
                    return false;
                  });

                  const domino = new Domino(a, b);
                  Domino.setupDomino(domino, [+r, +c], direction);

                  let isValid = false;
                  let dominoIndex = -1;

                  this.dominoGrid.availableDominos.forEach(
                    (anotherDomino, index) => {
                      if (Domino.areTheSame(domino, anotherDomino)) {
                        isValid = true;
                        dominoIndex = index;
                      }
                    }
                  );

                  this.isStartedPlacingDomino = false;
                  this.activeInputs = [];
                  this.enableInputs();

                  if (!isValid) {
                    this.domGrid[r][c].children[0].value = '';
                    this.domGrid[r][c].children[0].classList = '';
                    this.domGrid[r][c].children[0].disabled = false;
                    e.target.value = '';
                    e.target.classList = '';
                    return;
                  }

                  this.dominoGrid.availableDominos.splice(dominoIndex, 1);
                  console.log(domino);
                  this.dominoGrid.placeDomino(domino);
                  e.target.disabled = true;

                  if (this.dominoGrid.availableDominos.length === 0) {
                    this.showMessage('All dominos are placed!');
                    this.finishSolvingBtn.disabled = true;
                    this.disableInputs();
                    this.finishSolvingBtn.classList.remove('btn--disabled');
                    this.finishSolvingBtn.disabled = false;
                  }
                }
              } else {
                e.target.value = '';
                e.target.classList = '';
              }
            });
        }
      }
    }
  }

  disableInputs() {
    for (let i = 0; i < this.dominoGrid.size; i += 1) {
      for (let j = 0; j < this.dominoGrid.size; j += 1) {
        if (
          this.domGrid[i][j].children[0] &&
          this.domGrid[i][j].children[0].nodeName === 'INPUT' &&
          !this.domGrid[i][j].children[0].classList.contains('domino')
        ) {
          const isNotToMute = this.activeInputs.some((pos) => {
            const [r, c] = pos;
            return r === i && c === j;
          });

          if (!isNotToMute) {
            this.domGrid[i][j].children[0].disabled = true;
            this.domGrid[i][j].children[0].classList.add('muted');
          }
        }
        if (
          this.domGrid[i][j].children[0] &&
          this.domGrid[i][j].children[0].classList.contains('domino')
        ) {
          this.domGrid[i][j].children[0].disabled = true;
        }
      }
    }
  }

  enableInputs() {
    for (let i = 0; i < this.dominoGrid.size; i += 1) {
      for (let j = 0; j < this.dominoGrid.size; j += 1) {
        if (
          this.domGrid[i][j].children[0] &&
          this.domGrid[i][j].children[0].nodeName === 'INPUT' &&
          !this.domGrid[i][j].children[0].classList.contains('domino')
        ) {
          this.domGrid[i][j].children[0].disabled = false;
          this.domGrid[i][j].children[0].classList.remove('muted');
        }
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

    for (let i = 0; i < this.dominoGrid.size; i += 1) {
      for (let j = 0; j < this.dominoGrid.size; j += 1) {
        const { value } = this.domGrid[i][j].querySelector('input');
        if (value.length !== 0) {
          board[i][j] = new CellValue(+value, i, j);
        }
      }
    }
    return new DominoGrid(9, board);
  }

  hideMainButtons() {
    this.firstSection.classList.add('hide');
  }

  showMainButtons() {
    this.firstSection.classList.remove('hide');
  }

  showAddBoardButtons() {
    this.addBoardSection.classList.remove('hide');
  }

  hideAddBoardButtons() {
    this.addBoardSection.classList.add('hide');
  }

  showSolveBoardButtons() {
    this.solveBoardSection.classList.remove('hide');
    this.finishSolvingBtn.classList.add('btn--disabled');
    this.finishSolvingBtn.disabled = true;
  }

  hideSolveBoardButtons() {
    this.solveBoardSection.classList.add('hide');
  }

  showMessage(text) {
    this.message.classList.toggle('hide');
    this.message.innerText = text;
  }

  hideMessage() {
    this.message.classList.toggle('hide');
  }
}
