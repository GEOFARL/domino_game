import Domino from '../gameLogic/Domino';
import DominoGrid from '../gameLogic/DominoGrid';

export default class InputHandler {
  constructor() {
    this.isStartedPlacingDomino = false;
    this.activeInputs = [];
  }

  static handleNumberInput(input) {
    const enteredValue = input.value.trim();
    const isValid =
      enteredValue.length > 0 && +enteredValue > 0 && +enteredValue < 23;

    if (isValid) {
      input.classList.add('number');
    } else {
      input.value = '';
      input.classList = '';
    }
  }

  handleDominoInput(
    input,
    dominoGrid,
    domGrid,
    message,
    finishSolvingBtn,
    i,
    j
  ) {
    if (input.classList.contains('domino')) {
      return;
    }
    const enteredValue = input.value.trim();
    if (enteredValue.length > 0 && +enteredValue > 0 && +enteredValue < 7) {
      input.classList.add('domino');
      if (!this.isStartedPlacingDomino) {
        this.isStartedPlacingDomino = true;
        const directions = dominoGrid.findDirections(i, j);

        if (directions.length === 0) {
          this.isStartedPlacingDomino = false;
          input.classList.remove('domino');
          input.value = '';
          return;
        }

        directions.forEach((direction) => {
          const [offR, offC] = DominoGrid.offsets[direction];
          const pos = [i + offR, j + offC];
          this.activeInputs.push(pos);
        });
        this.activeInputs.push([i, j]);
        this.disableInputs(dominoGrid, domGrid);
      } else if (this.isStartedPlacingDomino) {
        const [r, c] = this.activeInputs[this.activeInputs.length - 1];
        const b = +input.value;
        const a = +domGrid[r][c].children[0].value;

        const offR = i - r;
        const offC = j - c;

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

        dominoGrid.availableDominos.forEach((anotherDomino, index) => {
          if (Domino.areTheSame(domino, anotherDomino)) {
            isValid = true;
            dominoIndex = index;
          }
        });

        this.isStartedPlacingDomino = false;
        this.activeInputs = [];
        InputHandler.enableInputs(dominoGrid, domGrid);

        if (!isValid) {
          domGrid[r][c].children[0].value = '';
          domGrid[r][c].children[0].classList = '';
          domGrid[r][c].children[0].disabled = false;
          input.value = '';
          input.classList = '';
          return;
        }

        dominoGrid.availableDominos.splice(dominoIndex, 1);
        dominoGrid.placeDomino(domino);
        input.disabled = true;

        if (dominoGrid.availableDominos.length === 0) {
          message.show('All dominos are placed!');
          finishSolvingBtn.disabled = true;
          this.disableInputs(dominoGrid, domGrid);
          finishSolvingBtn.classList.remove('btn--disabled');
          finishSolvingBtn.disabled = false;
        }
      }
    } else {
      input.value = '';
      input.classList = '';
    }
  }

  disableInputs(dominoGrid, domGrid) {
    for (let i = 0; i < dominoGrid.size; i += 1) {
      for (let j = 0; j < dominoGrid.size; j += 1) {
        if (
          domGrid[i][j].children[0] &&
          domGrid[i][j].children[0].nodeName === 'INPUT' &&
          !domGrid[i][j].children[0].classList.contains('domino')
        ) {
          const isNotToMute = this.activeInputs.some((pos) => {
            const [r, c] = pos;
            return r === i && c === j;
          });

          if (!isNotToMute) {
            domGrid[i][j].children[0].disabled = true;
            domGrid[i][j].children[0].classList.add('muted');
          }
        }
        if (
          domGrid[i][j].children[0] &&
          domGrid[i][j].children[0].classList.contains('domino')
        ) {
          domGrid[i][j].children[0].disabled = true;
        }
      }
    }
  }

  static enableInputs(dominoGrid, domGrid) {
    for (let i = 0; i < dominoGrid.size; i += 1) {
      for (let j = 0; j < dominoGrid.size; j += 1) {
        if (
          domGrid[i][j].children[0] &&
          domGrid[i][j].children[0].nodeName === 'INPUT' &&
          !domGrid[i][j].children[0].classList.contains('domino')
        ) {
          domGrid[i][j].children[0].disabled = false;
          domGrid[i][j].children[0].classList.remove('muted');
        }
      }
    }
  }
}
