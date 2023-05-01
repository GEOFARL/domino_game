export default class CellValue {
  constructor(value, row, col, dominoGrid) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.dominoGrid = dominoGrid;
    this.done = false;
  }
}
