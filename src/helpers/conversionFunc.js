import CellValue from '../gameLogic/CellValue';
import Domino from '../gameLogic/Domino';
import DominoGrid from '../gameLogic/DominoGrid';

export const convertToSimple = (boards) => {
  if (boards.length === 0) {
    return [];
  }
  const simpleBoards = [];
  boards.forEach((board) => {
    const justBoard = board.board;
    for (let r = 0; r < board.size; r += 1) {
      for (let c = 0; c < board.size; c += 1) {
        if (board.board[r][c] instanceof CellValue) {
          justBoard[r][c] = board.board[r][c].value;
        } else if (board.board[r][c] instanceof Domino) {
          justBoard[r][c] = `'${board.board[r][c].getValue(r, c)}'`;
        } else if (board.board[r][c] === false) {
          justBoard[r][c] = 0;
        }
      }
    }
    simpleBoards.push(justBoard);
  });
  return simpleBoards;
};

export const convertOutOfSimple = (boards) => {
  if (boards.length === 0) {
    return [];
  }
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
