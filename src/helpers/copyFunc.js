import CellValue from '../gameLogic/CellValue';
import Domino from '../gameLogic/Domino';
import DominoGrid from '../gameLogic/DominoGrid';

export default function copyDominoGrid(dominoGrid) {
  const newDominoGrid = new DominoGrid(dominoGrid.size, []);
  const newBoard = Array(dominoGrid.size)
    .fill(0)
    .map(() => Array(dominoGrid.size).fill(0));

  const newCellValues = [];
  for (let r = 0; r < dominoGrid.size; r += 1) {
    for (let c = 0; c < dominoGrid.size; c += 1) {
      if (dominoGrid.board[r][c] instanceof Domino) {
        newBoard[r][c] = copyDomino(dominoGrid.board[r][c]);
      } else if (dominoGrid.board[r][c] instanceof CellValue) {
        newBoard[r][c] = copyCellValue(dominoGrid.board[r][c], newDominoGrid);
        newCellValues.push(newBoard[r][c]);
      } else {
        newBoard[r][c] = dominoGrid.board[r][c];
      }
    }
  }

  const newAvailableDominos = [];
  dominoGrid.availableDominos.forEach((domino) => {
    newAvailableDominos.push(copyDomino(domino));
  });

  newDominoGrid.board = newBoard;
  newDominoGrid.availableDominos = newAvailableDominos;
  newDominoGrid.cellValues = newCellValues;

  return newDominoGrid;
}

export function copyDomino(domino) {
  const newDomino = structuredClone(domino);
  Object.setPrototypeOf(newDomino, Domino.prototype);
  return newDomino;
}

export function copyCellValue(cellValue, dominoGrid) {
  const newCellValue = structuredClone(cellValue);
  Object.setPrototypeOf(newCellValue, CellValue.prototype);
  newCellValue.dominoGrid = dominoGrid;
  return newCellValue;
}
