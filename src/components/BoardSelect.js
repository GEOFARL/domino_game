import BaseComponent from './BaseComponent';

export default class BoardSelect extends BaseComponent {
  addOption(index) {
    const option = document.createElement('option');
    option.value = index;
    option.innerText = `Board №${index + 1}`;
    this.element.appendChild(option);
  }

  removeOption(boards) {
    const selectOptions = [...this.element.children];
    selectOptions.forEach((option) => option.remove());
    boards.forEach((board, indexx) => this.addOption(indexx));
  }

  changeValue(newValue) {
    this.element.value = newValue;
  }
}
