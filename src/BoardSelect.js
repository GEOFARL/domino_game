export default class BoardSelect {
  constructor(selectEl) {
    this.select = selectEl;
  }

  addOption(index) {
    const option = document.createElement('option');
    option.value = index;
    option.innerText = `Board №${index + 1}`;
    this.select.appendChild(option);
  }

  removeOption(boards) {
    const selectOptions = [...this.select.children];
    selectOptions.forEach((option) => option.remove());
    boards.forEach((board, indexx) => this.addOption(indexx));
  }

  changeValue(newValue) {
    this.select.value = newValue;
  }
}
