export default class CellValue {
  constructor(value, row, col) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.done = false;
  }
}
